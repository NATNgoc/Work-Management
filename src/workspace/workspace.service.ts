import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { ConfigKey } from 'src/common/constaints';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workSpaceRepository: Repository<Workspace>,
    private readonly systemParamService: SystemparamsService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace | null> {
    const numberWorkspaceOfUser = await this.workSpaceRepository.countBy({
      owner_id: createWorkspaceDto.owner_id,
    });

    if (
      numberWorkspaceOfUser >=
      (await this.systemParamService.getValueByKey(
        ConfigKey.MAXIMUM_WORKSPACES_PER_USER,
      ))
    ) {
      throw new ConflictException(
        `user's userworkspace count - ${numberWorkspaceOfUser} is over the availible number (${ConfigKey.MAXIMUM_WORKSPACES_PER_USER}`,
      );
    }

    const newWorkSpace = this.workSpaceRepository.create({
      ...createWorkspaceDto,
    });

    return null;
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
