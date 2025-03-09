import { Test, TestingModule } from '@nestjs/testing';
import { MessageattachmentController } from './messageattachment.controller';

describe('MessageattachmentController', () => {
  let controller: MessageattachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageattachmentController],
    }).compile();

    controller = module.get<MessageattachmentController>(
      MessageattachmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
