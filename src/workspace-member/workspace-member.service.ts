import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { WorkspaceMember } from './entities/workspace-member.entity';

import WorkspaceMemberRole from '../enum/workspace-member-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Transaction } from 'typeorm';
import { CreateWorkspaceMemberDto } from '../workspace/dto/create-workspace-member.dto';
import { Transactional } from 'typeorm-transactional';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { UsersService } from 'src/users/users.service';
import FindAllMembersDto from './dto/find-all-member.dto';
import { User } from 'src/users/entities/users.entity';
import { FindAllWithUserDto } from './dto/find-all-with-user.dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workSpaceMemberRepository: Repository<WorkspaceMember>,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workSpaceService: WorkspaceService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async updateRole(
    workSpaceId: string,
    updatingUserId: string,
    requestUserId: string,
    role: WorkspaceMemberRole,
  ): Promise<WorkspaceMember> {
    const workspaceMember = await this.workSpaceMemberRepository.findOne({
      where: { workspaceId: workSpaceId, userId: updatingUserId },
    });

    if (!workspaceMember) {
      throw new NotFoundException('Workspace member not found');
    }

    const curWorkSpace = await this.workSpaceService.findOne(workSpaceId);
    if (!curWorkSpace) {
      throw new NotFoundException('Workspace is not exists');
    }

    const isOwner = curWorkSpace.owner_id === requestUserId;
    if (!isOwner) {
      throw new ForbiddenException("You aren't the owner of this workspace!");
    }

    if (role == WorkspaceMemberRole.OWNER) {
      throw new ConflictException('Owner has only one');
    }

    workspaceMember.role = role;
    await this.workSpaceMemberRepository.save(workspaceMember);

    return workspaceMember;
  }

  async findManyByIds(
    userIds: string[],
    workSpaceId,
  ): Promise<WorkspaceMember[] | null> {
    return await this.workSpaceMemberRepository.findBy({
      userId: In(userIds),
      workspaceId: workSpaceId,
    });
  }

  async create(
    createWorkspaceMemberData: CreateWorkspaceMemberDto,
  ): Promise<WorkspaceMember | null> {
    const existedOwner = await this.workSpaceMemberRepository.count({
      where: {
        role: WorkspaceMemberRole.OWNER,
        workspaceId: createWorkspaceMemberData.workspaceId,
      },
    });

    if (
      existedOwner > 0 &&
      createWorkspaceMemberData.role == WorkspaceMemberRole.OWNER
    ) {
      throw new ConflictException('Owner of this workspace already');
    }

    const result = this.workSpaceMemberRepository.create({
      workspaceId: createWorkspaceMemberData.workspaceId,
      userId: createWorkspaceMemberData.userId,
      role: createWorkspaceMemberData.role,
    });
    return await this.workSpaceMemberRepository.save(result);
  }

  async checkRoleUserInWorkSpace(
    workSpaceId: string,
    userId: string,
    role: WorkspaceMemberRole,
  ): Promise<boolean> {
    return (
      (await this.workSpaceMemberRepository.countBy({
        userId: userId,
        role: role,
        workspaceId: workSpaceId,
      })) == 1
    );
  }

  async getQueryBuilder() {
    return this.workSpaceMemberRepository.createQueryBuilder(
      'workspace_members',
    );
  }

  async findAllWithUserId(
    requestUserId: string,
    queryData: FindAllWithUserDto,
  ): Promise<WorkspaceMember[]> {
    const queryBuilder =
      this.workSpaceMemberRepository.createQueryBuilder('workspace_members');

    const { role, startDate, endDate, search, type } = queryData;

    queryBuilder.leftJoinAndSelect('workspace_members.workspace', 'workspace');

    queryBuilder.andWhere('workspace_members.user_id = :userId', {
      userId: requestUserId,
    });

    if (role) {
      queryBuilder.andWhere('workspace_members.role = :role', { role });
    }

    if (startDate) {
      queryBuilder.andWhere('workspace_members.created_at >= :startDate', {
        startDate,
      });
    }
    if (endDate) {
      queryBuilder.andWhere('workspace_members.created_at <= :endDate', {
        endDate,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(workspace.name LIKE :search OR workspace.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('workspace.type = :type', { type });
    }

    return await queryBuilder.getMany();
  }

  async findAllWithWorkspaceIdAndUserId(
    requestUserId: string,
    workSpaceId: string,
    queryData: FindAllMembersDto,
  ) {
    const curMember = await this.workSpaceMemberRepository.findOneBy({
      userId: requestUserId,
      workspaceId: workSpaceId,
    });
    if (!curMember) {
      throw new ForbiddenException("User aren't be member of this workspace");
    }

    const queryBuilder =
      this.workSpaceMemberRepository.createQueryBuilder('workspace_members');

    const { role, startDate, endDate } = queryData;
    queryBuilder.leftJoinAndSelect('workspace_members.user', 'user');

    queryBuilder.andWhere('workspace_members.workspace_id = :workspace_id', {
      workspace_id: workSpaceId,
    });

    if (role) {
      queryBuilder.andWhere('workspace_members.role = :role', {
        role,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'workspace_members.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    } else if (startDate) {
      queryBuilder.andWhere('workspace_members.created_at >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('workspace_members.created_at <= :endDate', {
        endDate,
      });
    }
    return await queryBuilder.getMany();
  }

  async findOne(
    workSpaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null> {
    return await this.workSpaceMemberRepository.findOneBy({
      userId: userId,
      workspaceId: workSpaceId,
    });
  }

  async findOneWithWorkSpace(
    workSpaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null> {
    return await this.workSpaceMemberRepository.findOne({
      where: {
        userId: userId,
        workspaceId: workSpaceId,
      },
      relations: ['workspace'],
    });
  }

  update() {}

  async delete(
    workSpaceId: string,
    deleteUserId: string,
    requestUserId: string,
  ): Promise<WorkspaceMember> {
    const [deleteMember, ownerMember] = await Promise.all([
      this.findOneWithWorkSpace(workSpaceId, deleteUserId),
      this.findOne(workSpaceId, requestUserId),
    ]);
    if (!deleteMember && !ownerMember) {
      throw new NotFoundException('some user are not belong to this workspace');
    }

    if (deleteMember.workspace.owner_id != requestUserId)
      throw new ForbiddenException(
        'You dont have permission to delete this member',
      );

    return await this.workSpaceMemberRepository.remove(deleteMember);
  }
}
