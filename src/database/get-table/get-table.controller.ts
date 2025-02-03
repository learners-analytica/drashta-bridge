import { Controller, Post, Body } from '@nestjs/common';
import { GetTableService } from './get-table.service';
import { requestTable } from './get-table.dto';

@Controller('get-table')
export class GetTableController {
  constructor(private readonly getTableService: GetTableService) {}

  @Post()
  async getTable(@Body() request: requestTable): Promise<any> {
    return this.getTableService.getDataBaseTable(request);
  }
}

