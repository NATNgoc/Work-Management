import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction, UpdateResult } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { ConfigKey } from 'src/common/constaints';
import { WorkspaceMemberService } from '../workspace-member/workspace-member.service';
import { WorkspaceMemberRole } from '../enum/workspace-member-role.enum';
import { Transactional } from 'typeorm-transactional';
import { User } from 'src/users/entities/users.entity';
import { NotFoundError } from 'rxjs';
import FindAllWorkSpaceDto from './dto/find-query.dto';
import UserRole from 'src/enum/user-role.enum';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workSpaceRepository: Repository<Workspace>,
    private readonly systemParamService: SystemparamsService,
    @Inject(forwardRef(() => WorkspaceMemberService))
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  @Transactional()
  async create(
    createWorkSpaceData: CreateWorkspaceDto,
    ownerId: string,
  ): Promise<Workspace | null> {
    const numberWorkspaceOfUser = await this.workSpaceRepository.countBy({
      owner_id: ownerId,
    });

    const maximumWorkSpace = await this.systemParamService.getValueByKey(
      ConfigKey.MAXIMUM_WORKSPACES_PER_USER,
    );

    if (numberWorkspaceOfUser >= maximumWorkSpace) {
      throw new ConflictException(
        `${numberWorkspaceOfUser} user's userworkspace is over the availible number |MAX: ${maximumWorkSpace}|`,
      );
    }

    const newWorkSpace = this.workSpaceRepository.create({
      ...createWorkSpaceData,
      owner_id: ownerId,
    });

    const result = await this.workSpaceRepository.save(newWorkSpace);

    await this.workSpaceMemberService.create({
      workspaceId: result.id,
      role: WorkspaceMemberRole.OWNER,
      userId: ownerId,
    });
    return result;
  }

  async findAll(
    queryData: FindAllWorkSpaceDto,
    requestUser: User,
  ): Promise<Workspace[] | null> {
    const queryBuilder =
      this.workSpaceRepository.createQueryBuilder('workspaces');

    let { ownerId, search, type, startDate, endDate } = queryData;
    if (requestUser.role != UserRole.ADMIN) {
      ownerId = requestUser.id;
    }
    ownerId &&
      queryBuilder.andWhere('workspaces.owner_id= :ownerId', { ownerId });
    type && queryBuilder.andWhere('workspaces.type= :type', { type });
    startDate &&
      queryBuilder.andWhere('workspaces.created_at>= :startDate', {
        startDate,
      });
    endDate &&
      queryBuilder.andWhere('workspaces.created_at<= :endDate', { endDate });
    if (search) {
      queryBuilder
        .andWhere('LOWER(workspaces.name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(workspaces.description) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
    }
    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Workspace | null> {
    return await this.workSpaceRepository.findOneBy({
      id: id,
    });
  }

  async checkWithId(workspaceId: string): Promise<boolean> {
    const result = await this.workSpaceRepository.find({
      select: { id: true },
      where: {
        id: workspaceId,
      },
    });
    return !result ? false : true;
  }

  async findOneWithUser(workspaceId: string) {
    return await this.workSpaceRepository.findOne({
      where: {
        id: workspaceId,
      },
      relations: ['owner'],
    });
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: User,
  ): Promise<UpdateResult | null> {
    const isOwner =
      await this.workSpaceMemberService.checkWithWorkSpaceRoleAndUserId(
        id,
        user.id,
        WorkspaceMemberRole.OWNER,
      );

    if (!isOwner) {
      throw new UnauthorizedException('User is not permitted doing that!');
    }

    const result = await this.workSpaceRepository.update(id, {
      ...(updateWorkspaceDto.name && { name: updateWorkspaceDto.name }),
      ...(updateWorkspaceDto.description && {
        description: updateWorkspaceDto.description,
      }),
    });
    return result;
  }

  async remove(
    requestUserId: string,
    workspaceId: string,
  ): Promise<Workspace | null> {
    const workSpace = await this.findOne(workspaceId);
    if (!workSpace) throw new NotFoundException('Workspace is not exist');
    if (workSpace.owner_id != requestUserId)
      throw new UnauthorizedException(
        'You dont have permission to delete this workspace',
      );
    return await this.workSpaceRepository.remove(workSpace);
  }
}
