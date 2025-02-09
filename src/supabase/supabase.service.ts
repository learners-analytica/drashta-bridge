import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type {TTableStructure} from '@learners-analytica/drashta-types-ts';
import * as dotenv from 'dotenv';
@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

  constructor() {
    // Replace these values with your Supabase project URL and public API key
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async checkIfTableExists(tableName: string): Promise<boolean> {
    const Tables:TTableStructure[] = await this.getTableStructData();
    const tableNames: string[] = Tables.map((table) => table.table_name);
    return Tables.some((table) => table.table_name === tableName);
  }

  async getTableStructData():Promise<TTableStructure[]> {
    const { data, error } = await this.supabase
      .from(process.env.VIEW_STRUCT)
      .select('*')

    if (error) {
        
      throw error;
    }

    return data;
  }

}

