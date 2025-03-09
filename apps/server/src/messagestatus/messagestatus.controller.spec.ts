import { Test, TestingModule } from '@nestjs/testing';
import { MessagestatusController } from './messagestatus.controller';

describe('MessagestatusController', () => {
  let controller: MessagestatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagestatusController],
    }).compile();

    controller = module.get<MessagestatusController>(MessagestatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
