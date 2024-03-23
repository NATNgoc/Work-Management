import { DeleteResult, Repository } from 'typeorm';
import { WorkspaceInvitation } from './enitities/workspace-invitation.entity';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { UsersService } from 'src/users/users.service';
import { WorkspaceType } from 'src/enum/workspace-type.enum';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { WorkspaceMemberRole } from '../enum/workspace-member-role.enum';
import { Transactional } from 'typeorm-transactional';
import { FindWorkspaceInvitationsDto } from './dto/find-workspace-invitation.dto';

@Injectable()
export class WorkspaceInvitationService {
  constructor(
    @InjectRepository(WorkspaceInvitation)
    private readonly workSpaceInvitationRepository: Repository<WorkspaceInvitation>,
    private readonly workSpaceService: WorkspaceService,
    @Inject(forwardRef(() => UsersService))
    private readonly userServivce: UsersService,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  async findAll(
    queryDto: FindWorkspaceInvitationsDto,
  ): Promise<WorkspaceInvitation[]> {
    const {
      workspaceId,
      invitingUserId,
      invitedUserId,
      status,
      startDate,
      endDate,
    } = queryDto;
    const queryBuilder = this.workSpaceInvitationRepository.createQueryBuilder(
      'workspace_invitations',
    );

    if (workspaceId) {
      queryBuilder.andWhere(
        'workspace_invitations.workspaceId = :workspaceId',
        {
          workspaceId,
        },
      );
    }

    if (invitingUserId) {
      queryBuilder.andWhere(
        'workspace_invitations.invitingUserId = :invitingUserId',
        { invitingUserId },
      );
    }

    if (invitedUserId) {
      queryBuilder.andWhere(
        'workspace_invitations.invitedUserId = :invitedUserId',
        { invitedUserId },
      );
    }

    if (status) {
      queryBuilder.andWhere('workspace_invitations.status = :status', {
        status,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'workspace_invitations.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    } else if (startDate) {
      queryBuilder.andWhere('workspace_invitations.createdAt >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('workspace_invitations.createdAt <= :endDate', {
        endDate,
      });
    }

    return await queryBuilder.getMany();
  }

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
    if (!invitation) {
      throw new NotFoundException("You haven't been invited before!");
    }

    if (invitation.status != WorkspaceInvitationStatus.PENDING) {
      throw new NotFoundException('Invitation is already accepted or rejected');
    }

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

  async create(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ): Promise<WorkspaceInvitation | null> {
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
      throw new ConflictException(
        'Workspace type is suitable for only one working',
      );
    }

    const [invitedUser, invitingUser] = await Promise.all([
      this.userServivce.findById(invitedUserId),
      this.userServivce.findById(invitingUserId),
    ]);

    if (!invitedUser || !invitingUser) {
      throw new NotFoundException('UserId input is unvalid');
    }

    const isOwner: boolean = invitingUser.id == workspace.owner_id;
    if (!isOwner) {
      throw new ForbiddenException("User's not permited to do that");
    }

    const result = this.workSpaceInvitationRepository.create({
      workspaceId: workspaceId,
      invitingUserId: invitingUserId,
      invitedUserId: invitedUserId,
    });

    return await this.workSpaceInvitationRepository.save(result);
  }

  @Transactional()
  async delete(
    workspaceId: string,
    invitingUserId: string,
    invitedUserId: string,
  ): Promise<DeleteResult | null> {
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
      throw new ForbiddenException("User's not permited to do that");
    }

    const result = await this.workSpaceInvitationRepository.delete({
      workspaceId: workspaceId,
      invitingUserId: invitingUserId,
      invitedUserId: invitedUserId,
    });

    return result;
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
}
