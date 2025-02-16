import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('get-table-column-data')
  async getTableColumnData(
    @Body('table') table: string, 
    @Body('column') column: string,
    @Body('size') size: number
  ){
    return await this.supabaseService.getColumnData(table, column, size)
  }

  @Post('get-table-data')
  async getTableData(
    @Body('table') table: string
  ){
    return await this.supabaseService.getTableData(table)
  }

  @Get('get-table-data-test')
  async getTableDataTest(){
    return await this.supabaseService.getTableData("contacts")
  }

  @Post('get-table-data-raw')
  async getTableDataRaw(
    @Body('table') table: string,
    @Body('columns') columns: string[]
  ){
    return await this.supabaseService.getTableDataRaw(table,columns)
  }
}

