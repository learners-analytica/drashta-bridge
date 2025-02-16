import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('get-column-head')
  async getColumnHead() {
    return this.supabaseService.getColumnData("expense_request", "expense_amount")
  }

  @Get('get-database-schema')
  async getTableInfo() {
    return this.supabaseService.getTableStructData()
  }

  @Get('get-table-column-name')
  async getTableColumnNames() {
    return this.supabaseService.getColumnNamesFromTable("expense_request")
  }

  @Get('get-table-head')
  async getTableHead(){
    return this.supabaseService.getTableHead("expense_request")
  }

  @Get('get-table-data-raw')
  async getTableDataRaw(){
    return this.supabaseService.getColumnDataValueArray("expense_request",5,"expense_amount")
  }
}

