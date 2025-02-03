import { Test, TestingModule } from '@nestjs/testing';
import { GetTableService } from './get-table.service';

describe('GetTableService', () => {
  let service: GetTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetTableService],
    }).compile();

    service = module.get<GetTableService>(GetTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
