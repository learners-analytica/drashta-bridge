import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { requestTable } from './get-table.dto';

@Injectable()
export class GetTablePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      return Object.assign(new requestTable(), value);
    }
    return value;
  }
}

