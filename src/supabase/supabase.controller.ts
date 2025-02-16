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

  @Post('get-table-data')
  async getTableData(
    @Body('table') table: string,
    @Body('size') size: number = 1000,
    @Body('columns') columns: string[] = null,
  ) {
    return this.supabaseService.getDataSeriesArrayFromTable(table, size, columns);
  }

  @Get('get-test-table-data')
  async getTableTestData() {
    return this.supabaseService.getDataSeriesArrayFromTable('expense_request',1000);
  }
}

