import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction, UpdateResult } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { ConfigKey } from 'src/common/constaints';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberRole } from './entities/workspace-member.entity';
import { Transactional } from 'typeorm-transactional';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workSpaceRepository: Repository<Workspace>,
    private readonly systemParamService: SystemparamsService,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  @Transactional()
  async create(
    createWorkSpaceData: CreateWorkspaceDto,
  ): Promise<Workspace | null> {
    const numberWorkspaceOfUser = await this.workSpaceRepository.countBy({
      owner_id: createWorkSpaceData.owner_id,
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
    });

    const result = await this.workSpaceRepository.save(newWorkSpace);

    await this.workSpaceMemberService.create({
      workspaceId: result.id,
      role: WorkspaceMemberRole.OWNER,
      userId: createWorkSpaceData.owner_id,
    });
    return result;
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: User,
  ): Promise<UpdateResult | null> {
    const isOwner =
      await this.workSpaceMemberService.checkWorkSpaceRoleByUserId(
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

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
