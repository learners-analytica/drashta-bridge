import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { TDataArray, TTableStructure, TDataSeriesHead, TTableMetaData, AggregationOperations, TDataSeriesMetadata, TDataSeries, TDataSeriesRaw, TColumnNames, TTableData } from '@learners-analytica/drashta-types-ts';
import * as dotenv from 'dotenv';

type TDatabaseStructure = TTableStructure[];
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Replace these values with your Supabase project URL and public API key
    const SUPABASE_URL = process.env.DATABASE_URL || '';
    const SUPABASE_KEY = process.env.DATABASE_KEY || '';
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async getDatabaseStructure():Promise<TDatabaseStructure> {
    const { data, error } = await this.supabase
      .from(process.env.VIEW_STRUCT)
      .select('*')

    if (error) {
        
      throw error;
    }

    return data;
  }

  async getTableHeadData(table:string):Promise<TTableStructure> {
    const DatabaseStructure:TDatabaseStructure = await this.getDatabaseStructure();
    const tableHeadData:TTableStructure = DatabaseStructure.find(table_head_data => table_head_data.table_name === table);
    return tableHeadData;
  }

  private async getColumnsHeadData(table:string):Promise<TDataSeriesHead[]> {
    const tableHeadData:TTableStructure = await this.getTableHeadData(table);
    const columns = tableHeadData.table_column_head_data;
    return columns;
  }

  private async getColumnNames(table:string):Promise<TColumnNames> {
    const columnsHeadData:TDataSeriesHead[] = await this.getColumnsHeadData(table);
    return columnsHeadData.map((columnsHeadData:TDataSeriesHead) => columnsHeadData.column_name);
  }


  private async getColumnAsObjectArray(table: string, column: string[], size: number = 100): Promise<TDataArray> {
    if (!Array.isArray(column)) {
      throw new Error("The 'column' parameter must be an array.");
    }
  
    const column_list: string = column.map((value) => `"${value}"`).join(',');
    const { data, error } = await this.supabase
      .from(table)
      .select(column_list)
      .limit(size);
    
    if (error) {
      throw error;
    }
  
    return data;
  }

  async getDataAsValueArray(table:string,column:string,size:number=100):Promise<TDataArray>{
    const data = await this.getColumnAsObjectArray(table, [column], size);
    return data.map((row) => row[column]);
  }

  private async getAggData(table:string,column, operation:AggregationOperations):Promise<number> {
    const { data, error } = await this.supabase
      .from(table)
      .select(`${column}.${operation}()`)
      .single()
      if (error) {
        return null
      }
      return data[operation.toLowerCase()]
  }

  private async getColumnHeadData(table:string, column_name: string): Promise<TDataSeriesHead> {
    const columnsHeadData:TDataSeriesHead[] = await this.getColumnsHeadData(table)
    return columnsHeadData.find((columnData) => columnData.column_name === column_name);
  }

  async getColumnData(table: string, columns: string[], size: number = 100): Promise<TDataArray> {
    const tableColumns = await this.getColumnNames(table);
    for (const col of columns) {
      if (!tableColumns.includes(col)) {
        throw new Error(`Column ${col} does not exist in table ${table}`);
      }
    }
    return this.getColumnAsObjectArray(table, columns, size);
  }

  async getColumnDataRaw(table:string,column:string,size:number=100):Promise<TDataSeriesRaw>{
    const head = await this.getColumnHeadData(table, column);
    const data = await this.getDataAsValueArray(table, column, size);
    const columnDataRaw:TDataSeriesRaw = {
      ...head,
      column_data:data
    }
    return columnDataRaw
  }

  private async getColumnMeta(table:string,column:string):Promise<TDataSeriesMetadata>{
    const columnMeta:TDataSeriesMetadata = {
      column_avg: await this.getAggData(table,column,AggregationOperations.AVG),
      column_count: await this.getAggData(table,column,AggregationOperations.COUNT),
      column_max: await this.getAggData(table,column,AggregationOperations.MAX),
      column_min:await this.getAggData(table,column,AggregationOperations.MIN)
    }
    return columnMeta
  }

  async getTableMetaData(table: string): Promise<TTableMetaData> {
    const PREVIEW_DATA_SIZE:number = 5;
    const columns: string[] = await this.getColumnNames(table);
    const dataSeries: TDataSeries[] = [];
    for (const column of columns) {
      const columnHead:TDataSeriesHead = await this.getColumnHeadData(table, column);
      const columnMeta:TDataSeriesMetadata = await this.getColumnMeta(table, column);
      const columnDataPreview:unknown[] = await this.getColumnData(table, [column], PREVIEW_DATA_SIZE);
      const dataSeriesItem: TDataSeries = {
        ...columnHead,
        column_avg: columnMeta.column_avg,
        column_count: columnMeta.column_count,
        column_max: columnMeta.column_max,
        column_min: columnMeta.column_min,
        column_data: columnDataPreview
      };
  
      dataSeries.push(dataSeriesItem);
    }
  
    return {
      table_name: table,
      table_data_series: dataSeries
    };
  }

  async getTableData(table:string,columns:string[],size:number=100):Promise<TTableData>{
    const table_data:TTableData = {
      table_name:table,
      table_data_series:await this.getColumnAsObjectArray(table,columns,size)
    }
    return table_data
  }

  async getDatabaseTables():Promise<string[]> {
    const { data, error } = await this.supabase
      .from(process.env.VIEW_STRUCT)
      .select('table_name')
  
    if (error) {
      throw error;
    }
  
    return data.map((row) => row.table_name);
  }
  
}

