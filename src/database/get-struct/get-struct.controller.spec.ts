import { Test, TestingModule } from '@nestjs/testing';
import { GetStructController } from './get-struct.controller';
import { GetStructService } from './get-struct.service';
import { TableStructure } from '@learners-analytica/drashta-types-ts';

describe('GetStructController', () => {
  let controller: GetStructController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetStructController],
      providers: [GetStructService],
    }).compile();

    controller = module.get<GetStructController>(GetStructController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the table structure', async () => {
    const result = await controller.getDatabaseStructure();
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

