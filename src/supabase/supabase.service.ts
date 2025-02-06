import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
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

  async getTest() {
    return {message:"Hello"}
  }

  async getTableData() {
    const { data, error } = await this.supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
        
      return error;
    }

    return data;
  }

}
