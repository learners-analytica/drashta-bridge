import { Test, TestingModule } from '@nestjs/testing';
import { GetTableController } from './get-table.controller';

describe('GetTableController', () => {
  let controller: GetTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetTableController],
    }).compile();

    controller = module.get<GetTableController>(GetTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
