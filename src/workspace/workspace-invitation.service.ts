import { DeleteResult, Repository } from 'typeorm';
import {
  WorkspaceInvitation,
  WorkspaceInvitationStatus,
} from './entities/workspace-invitation.entity';
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

  async delete(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ): Promise<DeleteResult | null> {
    await this.checkInputBeforeDelete(
      workspaceId,
      invitingUserId,
      invitedUserId,
    );
    const result = await this.workSpaceInvitationRepository.delete({
      workspaceId: workspaceId,
      invitingUserId: invitingUserId,
      invitedUserId: invitedUserId,
    });

    return result;
  }

  private async checkInputBeforeDelete(
    workspaceId,
    invitingUserId,
    invitedUserId,
  ) {
    const invitation = await this.checkExistingInvitation(
      workspaceId,
      invitingUserId,
      invitedUserId,
    );
    if (!invitation) {
      throw new ConflictException("You hadn't invited this user before!");
    }

    if (invitation.status != WorkspaceInvitationStatus.PENDING) {
      throw new ConflictException('Invalid status');
    }

    const workspace = await this.workSpaceService.findOne(workspaceId);
    if (!workspace || workspace.type == WorkspaceType.PERSONAL) {
      throw new ConflictException('Workspace is not valid');
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

  private async checkExistingInvitation(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ): Promise<WorkspaceInvitation | null> {
    const result = await this.workSpaceInvitationRepository.findOne({
      where: {
        workspaceId: workspaceId,
        invitingUserId: invitingUserId,
        invitedUserId: invitedUserId,
      },
    });
    return result;
  }

  private async checkInputBeforeCreate(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ) {
    if (invitingUserId == invitedUserId) {
      throw new ConflictException("You can't invite yourself");
    }
    if (
      await this.checkExistingInvitation(
        workspaceId,
        invitingUserId,
        invitedUserId,
      )
    ) {
      throw new ConflictException('You had invited this user before!');
    }

    const workspace = await this.workSpaceService.findOne(workspaceId);
    if (!workspace || workspace.type == WorkspaceType.PERSONAL) {
      throw new ConflictException('Workspace is not valid');
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
