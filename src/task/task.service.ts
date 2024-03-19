import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import TaskStatus from 'src/enum/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  async create(
    requestUserId: string,
    workspaceId: string,
    createTaskData: CreateTaskDto,
  ): Promise<Task | null> {
    const curMember = await this.workSpaceMemberService.findOne(
      workspaceId,
      requestUserId,
    );

    if (!curMember) {
      throw new NotFoundException('user is not belong to this workspace');
    }

    const result = this.taskRepository.create({
      title: createTaskData.title,
      description: createTaskData.description,
      dueDate: createTaskData.dueDate,
      workspaceId: workspaceId,
      createdBy: requestUserId,
    });

    if (
      curMember.role == WorkspaceMemberRole.LEADER ||
      curMember.role == WorkspaceMemberRole.OWNER
    ) {
      result.status = TaskStatus.ACCEPTED;
    } else {
      result.status = TaskStatus.PENDING;
    }

    await this.taskRepository.save(result);
    return result;
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
