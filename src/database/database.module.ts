import { Module } from '@nestjs/common';
import { GetStructService } from './get-struct/get-struct.service';
import { GetStructController } from './get-struct/get-struct.controller';
import { GetTableService } from './get-table/get-table.service';
import { GetTableController } from './get-table/get-table.controller';

@Module({
  providers: [GetStructService, GetTableService],
  controllers: [GetStructController, GetTableController]
})
export class DatabaseModule {}
