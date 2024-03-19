import { DeleteResult, Repository } from 'typeorm';
import { WorkspaceInvitation } from './enitities/workspace-invitation.entity';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { UsersService } from 'src/users/users.service';
import { WorkspaceType } from 'src/enum/workspace-type.enum';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { WorkspaceMemberRole } from '../enum/workspace-member-role.enum';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class WorkspaceInvitationService {
  constructor(
    @InjectRepository(WorkspaceInvitation)
    private readonly workSpaceInvitationRepository: Repository<WorkspaceInvitation>,
    private readonly workSpaceService: WorkspaceService,
    private readonly userServivce: UsersService,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  @Transactional()
  async updateStatus(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
    status: WorkspaceInvitationStatus,
  ) {
    const invitation = await this.workSpaceInvitationRepository.findOneBy({
      invitedUserId: invitedUserId,
      invitingUserId: invitingUserId,
      workspaceId: workspaceId,
    });
    await this.checkInputBeforeUpdate(invitation, status);

    if (status == WorkspaceInvitationStatus.ACCEPTED) {
      await this.workSpaceMemberService.create({
        workspaceId: workspaceId,
        role: WorkspaceMemberRole.MEMBER,
        userId: invitedUserId,
      });
    }

    invitation.status = status;
    return await this.workSpaceInvitationRepository.save(invitation);
  }

  private async checkInputBeforeUpdate(
    invitation: WorkspaceInvitation,
    status: WorkspaceInvitationStatus,
  ) {
    if (!invitation) {
      throw new NotFoundException("You haven't been invited before!");
    }

    if (invitation.status != WorkspaceInvitationStatus.PENDING) {
      throw new NotFoundException('Invitation is already accepted or rejected');
    }
  }

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
      this.userServivce.findById(invitedUserId),
      this.userServivce.findById(invitingUserId),
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
      this.userServivce.findById(invitedUserId),
      this.userServivce.findById(invitingUserId),
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
