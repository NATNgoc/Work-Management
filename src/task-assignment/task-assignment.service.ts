import {
  ConflictException,
  ForbiddenException,
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
import { Brackets, Repository } from 'typeorm';
import TaskStatus from 'src/enum/task-status.enum';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import { FindTaskAssignmentDto } from './dto/find-task.dto';
import { FindTaskAssignmentOfUserDto } from './dto/find-task-of-user.dto';

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
    if (!currentTask) {
      throw new NotFoundException('Task is existing');
    }
    if (currentTask.status != TaskStatus.ACCEPTED)
      throw new ConflictException("Task isn't already accepted");

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
      throw new ForbiddenException("User can't assign");
    }
    const result = await this.taskAssignmentRepo.create({
      taskId: taskId,
      userIdAssignedBy: requestUserId,
      userIdAssignedTo: assignedUserId,
    });

    await this.taskAssignmentRepo.save(result);
    return result;
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
      throw new ForbiddenException(
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

  async findAllForUser(
    queryData: FindTaskAssignmentOfUserDto,
    requestUserId: string,
  ): Promise<TaskAssignment[]> {
    const { isDone, dueDate, workspace_id, status, search } = queryData;
    const queryBuilder =
      this.taskAssignmentRepo.createQueryBuilder('task_assignments');

    // Join với bảng Task để có thể truy cập các trường của Task
    queryBuilder.leftJoinAndSelect('task_assignments.task', 'task');

    // Áp dụng các điều kiện truy vấn dựa trên Task
    if (workspace_id) {
      queryBuilder.andWhere('task.workspaceId = :workspaceId', {
        workspaceId: workspace_id,
      });
    }
    if (isDone != undefined) {
      queryBuilder.andWhere('task.isDone = :isDone', { isDone });
    }
    if (dueDate) {
      queryBuilder.andWhere('task.dueDate <= :dueDate', { dueDate });
    }
    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('task_assignments.userIdAssignedTo = :userId', {
          userId: requestUserId,
        }).orWhere('task_assignments.userIdAssignedBy = :userId', {
          userId: requestUserId,
        });
      }),
    );

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Sắp xếp kết quả truy vấn nếu cần
    queryBuilder.orderBy('task.dueDate', 'ASC'); // Ví dụ: sắp xếp theo dueDate

    return queryBuilder.getMany();
  }

  async findAllWithUserIdAndTaskId(
    queryData: FindTaskAssignmentDto,
    requestUserId: string,
    taskId: string,
  ): Promise<TaskAssignment[]> {
    const currentTask = await this.taskService.findOne(taskId);
    if (!currentTask) throw new NotFoundException('Task is not existing');
    const currentMember = await this.workSpaceMemberService.findOne(
      currentTask.workspaceId,
      requestUserId,
    );
    if (!currentMember)
      throw new ForbiddenException('User is not belong to this workspaces');

    const { userIdAssignedTo, userIdAssignedBy, startDate, endDate } =
      queryData;
    const queryBuilder =
      this.taskAssignmentRepo.createQueryBuilder('task_assignments');

    // Join với bảng users để lấy thông tin của người được giao và người giao
    queryBuilder
      .leftJoinAndSelect('task_assignments.userAssignedTo', 'userAssignedTo')
      .leftJoinAndSelect('task_assignments.userAssignedBy', 'userAssignedBy')
      .select([
        'task_assignments.taskId',
        'userAssignedTo.id',
        'userAssignedTo.name', // Chọn id và name của userAssignedTo
        'userAssignedBy.id',
        'userAssignedBy.name', // Chọn id và name của userAssignedBy
      ]);

    // Áp dụng các điều kiện truy vấn
    if (taskId) {
      queryBuilder.andWhere('task_assignments.task_id = :taskId', { taskId });
    }
    if (userIdAssignedTo) {
      queryBuilder.andWhere(
        'task_assignments.userId_assigned_to = :userIdAssignedTo',
        { userIdAssignedTo },
      );
    }
    if (userIdAssignedBy) {
      queryBuilder.andWhere(
        'task_assignments.userId_assigned_by = :userIdAssignedBy',
        { userIdAssignedBy },
      );
    }
    if (startDate) {
      queryBuilder.andWhere('task_assignments.createdAt >= :startDate', {
        startDate,
      });
    }
    if (endDate) {
      queryBuilder.andWhere('task_assignments.createdAt <= :endDate', {
        endDate,
      });
    }
    return queryBuilder.getMany();
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
