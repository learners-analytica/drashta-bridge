import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('get-database-structure')
  async getDatabaseStructure() {
    return this.supabaseService.getDatabaseStructure();
  }

  @Post('get-table-column-data')
  async getTableColumnData(
    @Body('table') table: string,
    @Body('columns') columns: string[],
    @Body('size') size: number,) {
    return this.supabaseService.getColumnData(table, columns, size);
  }

  @Post('get-table-structure')
  async getTableStructure(
    @Body('table') table: string,) {
    return this.supabaseService.getTableHeadData(table);
  }

  @Post('get-table-metadata')
  async getTableMetaData(
    @Body('table') table:string
  ){
    return this.supabaseService.getTableMetaData(table);
  }

 @Post('get-table-data')
  async getTableData(
    @Body('table') table: string,
    @Body('size') size: number,
    @Body('column') column:string) {
    return this.supabaseService.getColumnDataRaw(table,column,size);
  }

  @Post('get-table-data-raw')
  async getTableDataRaw(
    @Body("table") table:string,
    @Body("columns") columns:string[],
    @Body("size") size:number) 
  {
    return this.supabaseService.getTableData(table,columns,size)
  }
}

