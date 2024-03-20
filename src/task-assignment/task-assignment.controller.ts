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
@Controller('tasks/:id/assignments')
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
  findAll() {
    return this.taskAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskAssignmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskAssignmentDto: UpdateTaskAssignmentDto,
  ) {
    return this.taskAssignmentService.update(+id, updateTaskAssignmentDto);
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
