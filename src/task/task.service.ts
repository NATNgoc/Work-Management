import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Not, Repository, Transaction } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import TaskStatus from 'src/enum/task-status.enum';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { UpdateUserGeneralDto } from 'src/users/dto/update-user.dto';
import UpdateGeneralTaskInfoDto from './dto/update-general-info-task.dto';
import { FindUserTaskDto } from './dto/find-task.dto';
import { Transactional } from 'typeorm-transactional';
import UpdateTaskStatusDto from './dto/update-task-status.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  async deleteById(
    taskId: string,
    requestUserId: string,
  ): Promise<Task | null> {
    const currentTask = await this.taskRepository.findOneBy({ id: taskId });
    if (!currentTask) {
      throw new NotFoundException('Task is not existing');
    }
    const currentMember = await this.workSpaceMemberService.findOne(
      currentTask.workspaceId,
      requestUserId,
    );
    if (!currentMember) {
      throw new NotFoundException('User is not belong to this workspace');
    }
    if (!this.checkEditTaskPermission(currentTask, currentMember)) {
      throw new ForbiddenException("User can't delete");
    }
    return await this.taskRepository.remove(currentTask);
  }

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
    if ('isDone' in updateData) {
      if (currentTask.status != TaskStatus.ACCEPTED)
        throw new ConflictException(
          "Task is not accepted, so you can't set done state for it",
        );
    }

    const currentMember = await this.workSpaceMemberService.findOne(
      currentTask.workspaceId,
      requestUserId,
    );

    if (!currentMember) {
      throw new NotFoundException('User is not belonging to this workspace');
    }

    if (!this.checkEditTaskPermission(currentTask, currentMember)) {
      throw new ForbiddenException("User can't edit this task");
    }

    const result = await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ ...updateData })
      .where('id = :id', { id: taskId })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async findAll(findData: FindUserTaskDto): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks');
    const { workspace_id, created_by, search, isDone, status, dueDate } =
      findData;

    if (workspace_id) {
      queryBuilder.andWhere('tasks.workspace_id = :workspace_id', {
        workspace_id,
      });
    }
    if (created_by) {
      queryBuilder.andWhere('tasks.createdBy = :created_by', { created_by });
    }
    if (isDone != undefined) {
      queryBuilder.andWhere('tasks.isDone = :isDone', { isDone });
    }
    if (status) {
      queryBuilder.andWhere('tasks.status = :status', { status });
    }
    if (dueDate) {
      queryBuilder.andWhere('tasks.dueDate <= :dueDate', { dueDate });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOneBy({
      id: id,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  @Transactional()
  async updateTaskStatus(
    taskId: string,
    requestUserId,
    updateData: UpdateTaskStatusDto,
  ): Promise<Task> {
    const currentTask = await this.findOne(taskId);
    if (!currentTask) {
      throw new NotFoundException('Task is not existed');
    }
    if (currentTask.status != TaskStatus.PENDING)
      throw new ConflictException(
        'Task status is already accepted or rejected',
      );
    const currentMember = await this.workSpaceMemberService.findOne(
      currentTask.workspaceId,
      requestUserId,
    );
    if (!currentMember)
      throw new ForbiddenException('User is not beloing to this workspaces');

    if (
      currentMember.role == WorkspaceMemberRole.OWNER ||
      currentMember.role == WorkspaceMemberRole.LEADER
    ) {
      throw new ForbiddenException(
        'User is not permited edit this status of task',
      );
    }
    currentTask.status = updateData.status;
    await this.taskRepository.save(currentTask);
    return currentTask;
  }
}
