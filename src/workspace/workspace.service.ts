import {
  ConflictException,
  Inject,
  Injectable,
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

  findAll() {
    return `This action returns all workspace`;
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

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
