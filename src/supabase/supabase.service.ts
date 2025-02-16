import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type {TDataSeries, TTableStructure, TTableColumnEntry} from '@learners-analytica/drashta-types-ts';
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

  async getColumnStructFromTable(table:string):Promise<TTableColumnEntry[]>{
    const TableData = await this.getTableStructData()
    const ColumnsData = TableData.filter((tableData)=> tableData.table_name === table)
    const Columns:TTableColumnEntry[] = ColumnsData.map((columnsData)=> columnsData.table_columns).flat()
    return Columns;
  }

  async getColumnNamesFromTable(table:string):Promise<string[]>{
    const ColumnsData = await this.getColumnStructFromTable(table)
    const ColumnNames:string[] = ColumnsData.map((columnsData)=> columnsData.column_name)
    return ColumnNames
  }

  async getColumnData(table: string, size: number = 1000, column: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(table)
      .select(column)
      .limit(size)
    if (error) {
      throw error;
    }
    return data;
  }

  async getColumnCount(table:string,column:string):Promise<any>{
    const { data, error, count } = await this.supabase
      .from(table)
      .select(`${column}.count()`)
      .single();
    if (error) {
      throw error;
    }
    //@ts-expect-error
    return data.count;
  }

  async getColumnAvg(table:string,column:string):Promise<any>{
    const { data, error } = await this.supabase
      .from(table)
      .select(`${column}.avg()`)
      .single();
    if (error) {
      return null;
    }
    //@ts-expect-error
    return data.avg;
  }

  async convertColumnDataToDataSeries(columnsData: any[], columnStructData: TTableColumnEntry, columnCount:number, columnAvg:number): Promise<TDataSeries> {
    let dataSeries: TDataSeries = {
      series_data: columnsData,
      series_name: columnStructData.column_name,
      series_type: columnStructData.column_type,
      is_series_key: columnStructData.column_is_key === "YES",
      series_count: columnStructData.column_is_key === "YES" ? null : columnCount,
      series_mean: columnStructData.column_is_key === "YES" ? null : columnAvg
    };
    return dataSeries;
  }

  async getColumnStructData(table:string,column:string): Promise<TTableColumnEntry> {
    const tableColumnsStructData:TTableColumnEntry[] = await this.getColumnStructFromTable(table)
    const columnStructData:TTableColumnEntry = tableColumnsStructData.filter((columnStructData) => columnStructData.column_name === column)[0]
    return columnStructData;
  }

  async getDataSeriesArrayFromTable(table: string, size: number = 1000, columns: string[] = null): Promise<TDataSeries[]> {
    const dataSeriesArray: TDataSeries[] = [];
    const columnNames = columns || await this.getColumnNamesFromTable(table);

    for (const column of columnNames) {
      try {
        const columnsData = await this.getColumnData(table, size, column);
        const columnStructData = await this.getColumnStructData(table, column);
        const columnCount = await this.getColumnCount(table, column);
        const columnAvg = await this.getColumnAvg(table, column);
        const dataSeries = await this.convertColumnDataToDataSeries(columnsData, columnStructData, columnCount, columnAvg);
        dataSeriesArray.push(dataSeries);
      } catch (error) {
        console.error(`Error processing column ${column}:`, error);
      }
    }
    return dataSeriesArray;
  }
}

