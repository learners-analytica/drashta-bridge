import { Controller, Get } from '@nestjs/common';
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
    return this.supabaseService.getColumnNameFromTable('contacts');
  }

  @Get('get-test-table-data')
  async getTableData() {
    return this.supabaseService.getTableData('contacts');
  }
}

