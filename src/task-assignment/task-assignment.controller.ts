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
import { TaskAssignmentService } from './task-assignment.service';
import { CreateAndDeleteTaskAssignmentDto } from './dto/create-task-assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task-assignment.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FindTaskDto } from './dto/find-task.dto';
@Controller('tasks/:id/assignments')
@ApiTags('Task Assignment')
export class TaskAssignmentController {
  constructor(private readonly taskAssignmentService: TaskAssignmentService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  async create(
    @Body() createTaskAssignmentDto: CreateAndDeleteTaskAssignmentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return await this.taskAssignmentService.create(
      id,
      req.user.id,
      createTaskAssignmentDto.userId_assigned_to,
    );
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(
    @Body() queryData: FindTaskDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.taskAssignmentService.findAll(queryData, req.user.id, id);
  }

  @Delete()
  @UseGuards(JwtAccessTokenGuard)
  remove(
    @Body() deleteData: CreateAndDeleteTaskAssignmentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.taskAssignmentService.delete(
      id,
      req.user.id,
      deleteData.userId_assigned_to,
    );
  }
}
