import { Test, TestingModule } from '@nestjs/testing';
import { MessagestatusService } from './messagestatus.service';

describe('MessagestatusService', () => {
  let service: MessagestatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagestatusService],
    }).compile();

    service = module.get<MessagestatusService>(MessagestatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
