import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('get-struct-supabase')
  async getTableData() {
    return this.supabaseService.getTableData();
  }
}

