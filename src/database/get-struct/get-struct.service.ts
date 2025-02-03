import { Injectable } from '@nestjs/common';
import type { TableStructure } from '@learners-analytica/drashta-types-ts';
@Injectable()
export class GetStructService {
    getDatabaseStructure():TableStructure{
        return {
            tableName:"Users",
            tableColumns: [
                {
                    columnName:"id",
                    columnType:"int",
                }
            ]
        }
    }
}
