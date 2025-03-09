import { Test, TestingModule } from '@nestjs/testing';
import { ChanneluserController } from './channeluser.controller';

describe('ChanneluserController', () => {
  let controller: ChanneluserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChanneluserController],
    }).compile();

    controller = module.get<ChanneluserController>(ChanneluserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
