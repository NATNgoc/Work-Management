import { Repository } from 'typeorm';
import { WorkspaceInvitation } from './entities/workspace-invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WorkspaceInvitationService {
  constructor(
    @InjectRepository(WorkspaceInvitation)
    private readonly workSpaceInvitationRepository: Repository<WorkspaceInvitation>,
    private readonly workSpaceService: WorkspaceService,
    private readonly userServivce: UsersService,
  ) {}

  async create(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ) {
    if (!(await this.workSpaceService.checkWithId(workspaceId))) {
      throw new ConflictException('Workspace is not existing');
    }

    const [invitedUser, invitingUser] = await Promise.all([
      this.userServivce.checkExistsById(invitedUserId),
      this.userServivce.checkExistsById(invitingUserId),
    ]);

    if (!invitedUser || !invitingUser) {
      throw new NotFoundException('UserId is not valid!');
    }
  }
}
