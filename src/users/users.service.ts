import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserGeneralDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { AuthenticationService } from 'src/authentication/authentication.service';
import * as argon2 from 'argon2';
import { FindUserTaskDto } from './dto/find-user-task.dto';
import { TaskService } from 'src/task/task.service';
import { FindAllUserWorkSpaceDto } from './dto/find-user-workspaces.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { FindWorkspaceInvitationsDto } from 'src/workspace-invitation/dto/find-workspace-invitation.dto';
import { FindUserWorkspaceInvitationsDto } from './dto/find-user-invitation.dto';
import { WorkspaceInvitation } from 'src/workspace-invitation/enitities/workspace-invitation.entity';
import { WorkspaceInvitationService } from 'src/workspace-invitation/workspace-invitation.service';
import { Task } from 'src/task/entities/task.entity';
import { TaskAssignmentService } from 'src/task-assignment/task-assignment.service';
import {
  FindTaskAssignmentOfUserDto,
  TaskType,
} from 'src/task-assignment/dto/find-task-of-user.dto';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { FindAllWithUserDto } from 'src/workspace-member/dto/find-all-with-user.dto';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authService: AuthenticationService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => WorkspaceInvitationService))
    private readonly workspaceInvitationService: WorkspaceInvitationService,
    @Inject(forwardRef(() => TaskAssignmentService))
    private readonly taskAssignmentService: TaskAssignmentService,
    @Inject(forwardRef(() => WorkspaceMemberService))
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  async findUserTasks(
    queryData: FindTaskAssignmentOfUserDto,
    userId: string,
  ): Promise<TaskAssignment[] | Task[]> {
    if (queryData.taskType == TaskType.assignee) {
      return await this.taskAssignmentService.findAllForUser(queryData, userId);
    } else {
      return await this.taskService.findAll({
        created_by: userId,
        dueDate: queryData.dueDate,
        isDone: queryData.isDone,
        status: queryData.status,
        workspace_id: queryData.workspace_id,
        search: queryData.search,
      });
    }
  }

  async findUserInvitations(
    queryData: FindUserWorkspaceInvitationsDto,
    userId: string,
  ): Promise<WorkspaceInvitation[]> {
    const isForward: boolean = queryData.isForward;
    const option = {
      status: queryData.status,
      endDate: queryData.endDate,
      startDate: queryData.startDate,
    };
    if (isForward) {
      return await this.workspaceInvitationService.findAll({
        invitingUserId: userId,
        ...option,
      });
    }
    return await this.workspaceInvitationService.findAll({
      invitedUserId: userId,
      ...option,
    });
  }

  async updateGeneralInformation(
    userId: string,
    updateData: UpdateUserGeneralDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.update(userId, {
      ...updateData,
    });
    return user;
  }

  async findUserWorkspaces(
    queryData: FindAllWithUserDto,
    user: User,
  ): Promise<Workspace[] | WorkspaceMember[]> {
    return await this.workSpaceMemberService.findAllWithUserId(
      user.id,
      queryData,
    );
  }

  async changePassword(
    user: User,
    oldPass: string,
    newPass: string,
  ): Promise<User | null> {
    await this.authService.verifyPassword(oldPass, user.password);
    user.password = await argon2.hash(newPass);
    await this.userRepository.save(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async checkExistsByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async checkExistsById(id: string): Promise<Boolean> {
    const result = await this.userRepository.findOne({
      where: { id: id },
      select: { id: true },
    });
    return result != null ? true : false;
  }

  async createNew(createUserDto: CreateUserDto): Promise<User> {
    if (await this.checkExistsByEmail(createUserDto.email)) {
      throw new ConflictException();
    }
    const newUser = await this.userRepository.create(createUserDto);
    if (!newUser) {
      throw new BadRequestException();
    }
    await this.userRepository.save(newUser);
    return newUser;
  }
}
