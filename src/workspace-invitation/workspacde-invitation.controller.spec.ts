import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacdeInvitationController } from './WorkspacdeInvitationController';

describe('WorkspacdeInvitationController', () => {
  let controller: WorkspacdeInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacdeInvitationController],
    }).compile();

    controller = module.get<WorkspacdeInvitationController>(
      WorkspacdeInvitationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
