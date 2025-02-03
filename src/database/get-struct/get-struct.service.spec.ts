import { Test, TestingModule } from '@nestjs/testing';
import { GetStructService } from './get-struct.service';
import { TableStructure } from '@learners-analytica/drashta-types-ts';

describe('GetStructService', () => {
  let service: GetStructService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetStructService],
    }).compile();

    service = module.get<GetStructService>(GetStructService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the table structure', async () => {
    const result = await service.getDatabaseStructure();
    expect(result).toEqual<TableStructure>({
      tableName: 'Users',
      tableColumns: [
        {
          columnName: 'id',
          columnType: 'int',
        },
      ],
    });
  });
});

