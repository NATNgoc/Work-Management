import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAndDeleteTaskAssignmentDto } from './dto/create-task-assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task-assignment.dto';
import { TaskService } from 'src/task/task.service';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';
import { Repository } from 'typeorm';
import TaskStatus from 'src/enum/task-status.enum';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

@Injectable()
export class TaskAssignmentService {
  constructor(
    private readonly taskService: TaskService,
    private readonly workSpaceMemberService: WorkspaceMemberService,
    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepo: Repository<TaskAssignment>,
  ) {}

  async findOneWithTaskAndAssignedUserId(
    taskId: string,
    assignedUserId: string,
  ): Promise<TaskAssignment | null> {
    return await this.taskAssignmentRepo.findOne({
      where: {
        taskId: taskId,
        userIdAssignedTo: assignedUserId,
      },
      relations: ['task'],
    });
  }

  async create(taskId: string, requestUserId: string, assignedUserId: string) {
    const currentTask = await this.taskService.findOne(taskId);
    if (
      !currentTask ||
      currentTask.status == TaskStatus.PENDING ||
      currentTask.status == TaskStatus.REJECTED
    ) {
      throw new NotFoundException('Task is not valid');
    }

    const isExistedAssignment = await this.findOneWithTaskAndAssignedUserId(
      taskId,
      assignedUserId,
    );
    if (isExistedAssignment) {
      throw new ConflictException('User been assigned before!');
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
      !this.taskService.checkEditTaskPermission(
        currentTask,
        currentMembers[0].userId === requestUserId
          ? currentMembers[0]
          : currentMembers[1],
      )
    ) {
      throw new UnauthorizedException("User can't assign");
    }
    const result = await this.taskAssignmentRepo.create({
      taskId: taskId,
      userIdAssignedBy: requestUserId,
      userIdAssignedTo: assignedUserId,
    });

    return await this.taskAssignmentRepo.save(result);
  }

  async delete(
    taskId: string,
    requestUserId: string,
    assignedUserId: string,
  ): Promise<TaskAssignment | null> {
    const curentAssignment = await this.findOneWithTaskAndAssignedUserId(
      taskId,
      assignedUserId,
    );
    if (!curentAssignment)
      throw new NotFoundException('Assignments is not existing');
    const currentMember = await this.workSpaceMemberService.findOne(
      curentAssignment.task.workspaceId,
      requestUserId,
    );
    if (!currentMember)
      throw new NotFoundException(
        'User requesting is not belong to this workspace',
      );

    if (!this.checkEditAssignmentPermission(curentAssignment, currentMember))
      throw new UnauthorizedException(
        'You dont have permission to delete this assignment',
      );
    return await this.taskAssignmentRepo.remove(curentAssignment);
  }

  checkEditAssignmentPermission(
    assignment: TaskAssignment,
    currentMember: WorkspaceMember,
  ) {
    if (assignment.userIdAssignedBy == currentMember.userId) return true;
    if (
      currentMember.role == WorkspaceMemberRole.LEADER ||
      currentMember.role == WorkspaceMemberRole.OWNER
    )
      return true;

    return false;
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
