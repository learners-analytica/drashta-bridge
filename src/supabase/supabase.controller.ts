import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('get-struct-supabase')
  async getTableStructData() {
    return this.supabaseService.getTableStructData();
  }

  @Get('get-test-table-info')
  async getTableInfo() {
    return this.supabaseService.getColumnStructData('expense_request','expense_name');
  }
  @Post('get-data-series')
  async getDataSeriesFromTable(
    @Body('table') table: string,
    @Body('size') size: number = 1000,
    @Body('column') column: string,
  ) {
    if (!table || !column) {
      throw new Error('Table name and column name cannot be null or empty.');
    }
    return this.supabaseService.getDataSeriesFromTable(table, size, column);
  }

  @Post ('get-table-data')
  async getTableData(
    @Body('table') table: string,
  ){
    return this.supabaseService.getDataSeriesArrayFromTable(table);
  }

  @Get('get-test-table-data')
  async getTableTestData() {
    return this.supabaseService.getDataSeriesArrayFromTable('expense_request',1000);
  }
}

