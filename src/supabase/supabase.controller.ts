import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('get-table-data')
  async getTableColumnData(
    @Body('table') table: string, 
    @Body('column') column: string,
    @Body('size') size: number
  ){
    return await this.supabaseService.getColumnData(table, column, size)
  }
}

