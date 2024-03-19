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
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { Request } from 'express';
import { WorkspaceService } from './workspace.service';
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  async create(
    @Req() req: Request,
    @Body() createWorkSpaceData: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return await this.workspaceService.create(
      {
        ...createWorkSpaceData,
      },
      req.user.id,
    );
  }

  @Delete()
  @UseGuards(JwtAccessTokenGuard)
  async delete(
    @Req() req: Request,
    @Body() createWorkSpaceData: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return await this.workspaceService.create(
      {
        ...createWorkSpaceData,
      },
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.workspaceService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Req() req: Request,
  ) {
    return await this.workspaceService.update(id, updateWorkspaceDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
