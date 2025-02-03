import { Injectable } from '@nestjs/common';
import type { DataSeries } from '@learners-analytica/drashta-types-ts';
@Injectable()
export class GetTableService {
    getDataBaseTable():DataSeries[]{
        return []
    }
}