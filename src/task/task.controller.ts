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

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.taskService.create(req.user.id, createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  async updateGeneralInfo(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateGeneralTaskInfoDto,
    @Req() req: Request,
  ) {
    return this.taskService.updateGeneralInfo(req.user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
