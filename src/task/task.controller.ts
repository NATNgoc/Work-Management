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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { Request } from 'express';
import { Task } from './entities/task.entity';
import UpdateGeneralTaskInfoDto from './dto/update-general-info-task.dto';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import UpdateTaskStatusDto from './dto/update-task-status.dto';

@Controller('tasks')
@ApiTags('Task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.taskService.create(req.user.id, createTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    return await this.taskService.deleteById(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Update general information of a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: UpdateGeneralTaskInfoDto })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateGeneralTaskInfoDto,
    @Req() req: Request,
  ) {
    return this.taskService.updateGeneralInfo(req.user.id, id, updateTaskDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Update the status of a task' })
  @ApiResponse({
    status: 200,
    description: 'The task status has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async updateStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateData: UpdateTaskStatusDto,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(id, req.user.id, updateData);
  }
}
