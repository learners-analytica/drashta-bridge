import { Injectable } from '@nestjs/common';
import type { DataSeries } from '@learners-analytica/drashta-types-ts';
import { requestTable } from './get-table.dto';
@Injectable()
export class GetTableService {
    getDataBaseTable(request: requestTable):DataSeries[]{
        return []
    }
}
