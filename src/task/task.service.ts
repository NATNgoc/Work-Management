import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Not, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import TaskStatus from 'src/enum/task-status.enum';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { UpdateUserGeneralDto } from 'src/users/dto/update-user.dto';
import UpdateGeneralTaskInfoDto from './dto/update-general-info-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  async create(
    requestUserId: string,
    createTaskData: CreateTaskDto,
  ): Promise<Task | null> {
    const currentMember = await this.workSpaceMemberService.findOne(
      createTaskData.workSpaceId,
      requestUserId,
    );

    if (!currentMember) {
      throw new NotFoundException('user is not belong to this workspace');
    }

    const result = this.taskRepository.create({
      title: createTaskData.title,
      description: createTaskData.description,
      dueDate: createTaskData.dueDate,
      workspaceId: createTaskData.workSpaceId,
      createdBy: requestUserId,
    });

    if (
      currentMember.role == WorkspaceMemberRole.LEADER ||
      currentMember.role == WorkspaceMemberRole.OWNER
    ) {
      result.status = TaskStatus.ACCEPTED;
    } else {
      result.status = TaskStatus.PENDING;
    }

    await this.taskRepository.save(result);
    return result;
  }

  public checkEditTaskPermission(
    task: Task,
    workSpaceMemeber: WorkspaceMember,
  ): boolean {
    if (task.createdBy == workSpaceMemeber.userId) {
      return true;
    }

    if (
      workSpaceMemeber.role == WorkspaceMemberRole.LEADER ||
      workSpaceMemeber.role == WorkspaceMemberRole.OWNER
    ) {
      return true;
    }
    return false;
  }

  async updateGeneralInfo(
    requestUserId: string,
    taskId: string,
    updateData: UpdateGeneralTaskInfoDto,
  ): Promise<Task | null> {
    const currentTask = await this.taskRepository.findOneBy({
      id: taskId,
    });

    if (!currentTask) {
      throw new NotFoundException('Check task id again!');
    }

    const currentMember = await this.workSpaceMemberService.findOne(
      currentTask.workspaceId,
      requestUserId,
    );

    if (!currentMember) {
      throw new NotFoundException('User is not belonging to this workspace');
    }

    if (!this.checkEditTaskPermission(currentTask, currentMember)) {
      throw new UnauthorizedException("User can't edit this task");
    }

    const result = await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ ...updateData })
      .where('id = :id', { id: taskId })
      .returning('*') // Trả về tất cả các trường của thực thể sau khi cập nhật
      .execute();

    return result.raw[0];
  }

  findAll() {
    return `This action returns all task`;
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOneBy({
      id: id,
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
