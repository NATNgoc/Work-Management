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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindWorkspaceTaskDto } from './dto/find-workspace-task.dto';
import { Task } from 'src/task/entities/task.entity';
@Controller('workspaces')
@ApiTags('Workspace')
@ApiBearerAuth()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({
    status: 201,
    description: 'The workspace has been successfully created.',
    type: Workspace,
  })
  @ApiBody({ type: CreateWorkspaceDto })
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
  @ApiOperation({ summary: 'Find all workspaces' })
  @ApiResponse({
    status: 200,
    description: 'Return all workspaces.',
    type: [Workspace],
  })
  async findAll(
    @Query() query: FindAllWorkSpaceDto,
    @Req() req: Request,
  ): Promise<Workspace[]> {
    return await this.workspaceService.findAll(query, req.user);
  }

  @Get(':id/tasks')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Find all tasks in a workspace' })
  @ApiResponse({
    status: 200,
    description: 'Return all tasks in the specified workspace.',
    type: [Task],
  })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  async findAllTaskInWorkSpace(
    @Param('id') id: string,
    @Query() query: FindWorkspaceTaskDto,
    @Req() req: Request,
  ): Promise<Task[]> {
    return await this.workspaceService.findAllTasks(query, id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Update workspace information' })
  @ApiResponse({
    status: 200,
    description: 'The workspace has been successfully updated.',
    type: Workspace,
  })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: UpdateWorkspaceDto })
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Req() req: Request,
  ) {
    return await this.workspaceService.update(id, updateWorkspaceDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Remove a workspace' })
  @ApiResponse({
    status: 200,
    description: 'The workspace has been successfully removed.',
  })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Workspace | null> {
    return await this.workspaceService.remove(req.user.id, id);
  }
  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Get workspace details' })
  @ApiResponse({
    status: 200,
    description: 'Return workspace details.',
    type: Workspace,
  })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  async getWorkspace(@Param('id') id: string): Promise<Workspace> {
    const curWorkSpace = await this.workspaceService.findOne(id);
    if (!curWorkSpace) throw new NotFoundException('Workspace is not existing');
    return curWorkSpace;
  }
}
