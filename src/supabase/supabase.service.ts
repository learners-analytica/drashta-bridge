import { Injectable } from '@nestjs/common';
import type {SupabaseClient} from '@supabase/supabase-js';
import { AuthWeakPasswordError, createClient } from '@supabase/supabase-js';
import type {TTableStructure, TColumnStructureHead, TColumnStructureMeta, TColumnStructureData, TTableData, TDataArray} from '@learners-analytica/drashta-types-ts';
import { AggregrateOperations } from '@learners-analytica/drashta-types-ts';
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

  async getColumnStructFromTable(table:string):Promise<TColumnStructureHead[]>{
    const TableData = await this.getTableStructData()
    const ColumnsData = TableData.filter((tableData)=> tableData.table_name === table)
    const Columns:TColumnStructureHead[] = ColumnsData.map((columnsData)=> columnsData.table_columns).flat()
    return Columns;
  }

  async getColumnNamesFromTable(table:string):Promise<string[]>{
    const ColumnsData = await this.getColumnStructFromTable(table)
    const ColumnNames:string[] = ColumnsData.map((columnsData)=> columnsData.column_name)
    return ColumnNames
  }

  async getColumnDataObjectArray(table: string, size: number = 1000, column: string): Promise<unknown[]> {
    const { data, error } = await this.supabase
      .from(table)
      .select(column)
      .limit(size)
    if (error) {
      throw error;
    }
    return data;
  }

  async getMultiColumnDataObjectArray(table: string, size: number = 1000, columns: string|string[]): Promise<unknown[]> {
    const columnList = Array.isArray(columns) ? columns : [columns];
    const { data, error } = await this.supabase
      .from(table)
      .select(columnList.join(','))
      .limit(size)
    if (error) {
      throw error;
    }
    return data;
  }

  async getColumnDataValueArray(table:string, size:number = 1000, column:string):Promise<unknown[]>{
    const data = await this.getColumnDataObjectArray(table, size, column);
    return data.map((row) => row[column]);
  }

  async getAggOperations(table:string,column:string,operation:AggregrateOperations):Promise<number>{
    const { data, error } = await this.supabase
      .from(table)
      .select(`${column}.${operation}()`)
      .single();
    if (error) {
      return null;
    }
    return data[operation.toLowerCase()];
  }

  async getColumnHead(table:string,column:string):Promise<TColumnStructureHead>{
    const tableColumnsStructData:TColumnStructureHead[] = await this.getColumnStructFromTable(table)
    const columnStructData:TColumnStructureHead = tableColumnsStructData.filter((columnStructData) => columnStructData.column_name === column)[0]
    return columnStructData;
  }

  async getColumnMeta(table:string,column:string):Promise<TColumnStructureMeta>{
    const tableColumnsStructData:TColumnStructureHead = await this.getColumnHead(table,column)
    const columnStructMeta:TColumnStructureMeta = {
      ...tableColumnsStructData,
      column_mean: await this.getAggOperations(table, column, AggregrateOperations.AVG),
      column_count: await this.getAggOperations(table, column, AggregrateOperations.COUNT),
      column_min: await this.getAggOperations(table, column, AggregrateOperations.MIN),
      column_max: await this.getAggOperations(table, column, AggregrateOperations.MAX),
      column_data_preview: await this.getColumnDataValueArray(table, 5, column)
    }
    return columnStructMeta;
  }

  async getColumnData(table:string,column:string,size:number = 1000):Promise<TColumnStructureData>{
    const tableColumnsStructMeta:TColumnStructureMeta = await this.getColumnMeta(table,column);
    const columnStructData:TColumnStructureData = {
      ...tableColumnsStructMeta,
      column_data: await this.getColumnDataValueArray(table, size, column)
    };
    return columnStructData;
  }

  async getTableHead(table:string):Promise<TTableStructure>{
    const columns = await this.getColumnNamesFromTable(table)
    const tableStructData:TTableStructure = {
      table_name: table,
      table_columns: await Promise.all(columns.map((column) => this.getColumnHead(table, column)))
    }
    return tableStructData
  }

  async getTableMeta(table:string):Promise<TTableStructure>{
    const columns = await this.getColumnNamesFromTable(table)
    const tableStructData:TTableStructure = {
      table_name: table,
      table_columns: await Promise.all(columns.map((column) => this.getColumnHead(table, column)))
    }
    return tableStructData
  }

  async getTableData(table:string):Promise<TTableData>{
    const columns = await this.getColumnNamesFromTable(table)
    const tableStructData:TTableData = {
      table_name: table,
      table_columns_data: await Promise.all(columns.map((column) => this.getColumnData(table, column)))
    }
    return tableStructData
  }

  async getTableDataRaw(table:string,columns:string[]):Promise<any[]>{
    return await this.getMultiColumnDataObjectArray(table, 1000, columns)
  }
}

