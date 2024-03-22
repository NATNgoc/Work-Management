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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { Request } from 'express';
import { WorkspaceService } from './workspace.service';
import FindAllWorkSpaceDto from './dto/find-query.dto';
import UserRole from 'src/enum/user-role.enum';
import RoleGuard from 'src/authentication/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';
@Controller('workspaces')
@ApiTags('Workspace')
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

  @Get()
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAccessTokenGuard)
  async findAll(
    @Query() query: FindAllWorkSpaceDto,
    @Req() req: Request,
  ): Promise<Workspace[]> {
    return await this.workspaceService.findAll(query, req.user);
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
  @UseGuards(JwtAccessTokenGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Workspace | null> {
    return await this.workspaceService.remove(req.user.id, id);
  }
  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  async getWorkspace(@Param('id') id: string): Promise<Workspace> {
    const curWorkSpace = await this.workspaceService.findOne(id);
    if (!curWorkSpace) throw new NotFoundException('Workspace is not existing');
    return curWorkSpace;
  }
}
