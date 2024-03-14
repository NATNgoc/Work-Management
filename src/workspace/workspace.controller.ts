import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { ConfigKey } from 'src/common/constaints';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly systemParamsService: SystemparamsService,
  ) {}

  @Post()
  async create() {
    return {
      result: await this.systemParamsService.getValueByKey(
        ConfigKey.MAXIMUM_WORKSPACES_PER_USER,
      ),
    };
  }

  @Get()
  findAll() {
    return this.workspaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
