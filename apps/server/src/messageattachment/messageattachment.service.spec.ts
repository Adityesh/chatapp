import { Test, TestingModule } from '@nestjs/testing';
import { MessageattachmentService } from './messageattachment.service';

describe('MessageattachmentService', () => {
  let service: MessageattachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageattachmentService],
    }).compile();

    service = module.get<MessageattachmentService>(MessageattachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
