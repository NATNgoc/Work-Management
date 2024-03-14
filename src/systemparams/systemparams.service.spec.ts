import { Test, TestingModule } from '@nestjs/testing';
import { SystemparamsService } from './systemparams.service';

describe('SystemparamsService', () => {
  let service: SystemparamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemparamsService],
    }).compile();

    service = module.get<SystemparamsService>(SystemparamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
