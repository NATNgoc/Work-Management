import { Repository } from 'typeorm';
import { WorkspaceInvitation } from './entities/workspace-invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UsersService } from 'src/users/users.service';
import { WorkspaceType } from './entities/workspace.entity';

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
  ): Promise<WorkspaceInvitation | null> {
    await this.checkInputBeforeCreate(
      workspaceId,
      invitingUserId,
      invitedUserId,
    );
    const result = this.workSpaceInvitationRepository.create({
      workspaceId: workspaceId,
      invitingUserId: invitingUserId,
      invitedUserId: invitedUserId,
    });

    return await this.workSpaceInvitationRepository.save(result);
  }

  private async checkExistingInvitation(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ): Promise<boolean> {
    const count = await this.workSpaceInvitationRepository.count({
      where: {
        workspaceId: workspaceId,
        invitingUserId: invitingUserId,
        invitedUserId: invitedUserId,
      },
    });
    return count === 1;
  }

  private async checkInputBeforeCreate(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ) {
    if (
      this.checkExistingInvitation(workspaceId, invitingUserId, invitedUserId)
    ) {
      throw new ConflictException('You had invited this user before!');
    }

    const workspace = await this.workSpaceService.findOne(workspaceId);
    if (!workspace || workspace.type == WorkspaceType.PERSONAL) {
      throw new ConflictException('Workspace is not valid');
    }

    if (invitingUserId == invitedUserId) {
      throw new ConflictException("You can't invite yourself");
    }

    const [invitedUser, invitingUser] = await Promise.all([
      this.userServivce.checkExistsById(invitedUserId),
      this.userServivce.checkExistsById(invitingUserId),
    ]);

    if (!invitedUser || !invitingUser) {
      throw new NotFoundException('UserId is not valid!');
    }

    const isOwner: boolean = invitingUser.id == workspace.owner_id;
    if (!isOwner) {
      throw new UnauthorizedException("User's not permited to do that");
    }
  }
}
