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
} from '@nestjs/common';
import { TaskAssignmentService } from './task-assignment.service';
import { CreateAndDeleteTaskAssignmentDto } from './dto/create-task-assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task-assignment.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindTaskAssignmentDto } from './dto/find-task.dto';
import { TaskAssignment } from './entities/task-assignment.entity';

@ApiTags('TaskAssignment')
@ApiBearerAuth()
@Controller('tasks/:id/assignments')
export class TaskAssignmentController {
  constructor(private readonly taskAssignmentService: TaskAssignmentService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Create a task assignment' })
  @ApiResponse({
    status: 201,
    description: 'The task assignment has been successfully created.',
    type: TaskAssignment,
  })
  @ApiBody({ type: CreateAndDeleteTaskAssignmentDto })
  async create(
    @Body() createTaskAssignmentDto: CreateAndDeleteTaskAssignmentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<TaskAssignment> {
    return await this.taskAssignmentService.create(
      id,
      req.user.id,
      createTaskAssignmentDto.userId_assigned_to,
    );
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Find all task assignments' })
  @ApiResponse({
    status: 200,
    description: 'Return all task assignments.',
    type: [TaskAssignment],
  })
  findAll(
    @Param('id') id: string,
    @Query() queryData: FindTaskAssignmentDto,
    @Req() req: Request,
  ): Promise<TaskAssignment[]> {
    return this.taskAssignmentService.findAllWithUserIdAndTaskId(
      queryData,
      req.user.id,
      id,
    );
  }

  @Delete()
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Remove a task assignment' })
  @ApiResponse({
    status: 200,
    description: 'The task assignment has been successfully deleted.',
  })
  @ApiBody({ type: CreateAndDeleteTaskAssignmentDto })
  async remove(
    @Body() deleteData: CreateAndDeleteTaskAssignmentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ message: 'Delete successfully' }> {
    await this.taskAssignmentService.delete(
      id,
      req.user.id,
      deleteData.userId_assigned_to,
    );
    return {
      message: 'Delete successfully',
    };
  }
}
