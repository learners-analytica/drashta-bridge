import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type {TDataSeries, TTableStructure} from '@learners-analytica/drashta-types-ts';
import * as dotenv from 'dotenv';
@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

  constructor() {
    // Replace these values with your Supabase project URL and public API key
    const SUPABASE_URL = process.env.DATABASE_URL || '';
    const SUPABASE_KEY = process.env.DATABASE_KEY || '';
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async checkIfTableExists(tableName: string): Promise<boolean> {
    const Tables: TTableStructure[] = await this.getTableStructData();
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

  async getColumnNameFromTable(table:string):Promise<unknown[]>{
    const TableData = await this.getTableStructData()
    const ColumnsData = TableData.filter((tableData)=> tableData.table_name === table)
    const Columns = ColumnsData.map((columnsData)=> columnsData.table_columns).flat()
    return Columns;
  }

  async getTableData(table: string, size: number = 1000, columns: string[] = null): Promise<any> {
    const columnStr = columns ? columns.join(',') : '*';
    const { data, error } = await this.supabase
      .from(table)
      .select(columnStr)
      .limit(size)
    if (error) {
      throw error;
    }
    return data;
  }

}

