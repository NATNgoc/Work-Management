import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { ConfigKey } from 'src/common/constaints';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { Request } from 'express';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly systemParamsService: SystemparamsService,
  ) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  async create(
    @Req() req: Request,
    @Body() createWorkSpaceData: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return await this.workspaceService.create({
      ...createWorkSpaceData,
      owner_id: req.user.id,
    });
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
