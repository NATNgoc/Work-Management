import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskAssignmentDto } from './dto/create-task-assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task-assignment.dto';
import { TaskService } from 'src/task/task.service';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';
import { Repository } from 'typeorm';
import TaskStatus from 'src/enum/task-status.enum';

@Injectable()
export class TaskAssignmentService {
  constructor(
    private readonly taskService: TaskService,
    private readonly workSpaceMemberService: WorkspaceMemberService,
    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepo: Repository<TaskAssignment>,
  ) {}
  /*
    - Là member trong workspace
    - Có quyền edit
    - task phải tồn tại
  */
  async create(taskId: string, requestUserId: string, assignedUserId: string) {
    await this.checkBeforeCreate(taskId, requestUserId, assignedUserId);

    const result = await this.taskAssignmentRepo.create({
      taskId: taskId,
      userIdAssignedBy: requestUserId,
      userIdAssignedTo: assignedUserId,
    });

    return await this.taskAssignmentRepo.save(result);
  }

  private async checkBeforeCreate(
    taskId: string,
    requestUserId: string,
    assignedUserId: string,
  ) {
    const currentTask = await this.taskService.findOne(taskId);
    if (
      !currentTask ||
      currentTask.status == TaskStatus.PENDING ||
      currentTask.status == TaskStatus.REJECTED
    ) {
      throw new NotFoundException('Task is not valid');
    }
    const currentMembers = await this.workSpaceMemberService.findManyByIds(
      [requestUserId, assignedUserId],
      currentTask.workspaceId,
    );
    if (currentMembers.length != 2) {
      if (
        currentMembers.length == 0 ||
        (currentMembers.length == 1 && requestUserId != assignedUserId)
      ) {
        throw new NotFoundException(
          'Users are not belonging to this workspace',
        );
      }
    }
    if (
      !this.taskService.checkEditTaskPermission(currentTask, currentMembers[0])
    ) {
      throw new UnauthorizedException("User can't assign");
    }
  }

  findAll() {
    return `This action returns all taskAssignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskAssignment`;
  }

  update(id: number, updateTaskAssignmentDto: UpdateTaskAssignmentDto) {
    return `This action updates a #${id} taskAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskAssignment`;
  }
}
