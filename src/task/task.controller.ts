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

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    return await this.taskService.deleteById(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateGeneralTaskInfoDto,
    @Req() req: Request,
  ) {
    return this.taskService.update(req.user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAccessTokenGuard)
  updateStatus() {}
}
