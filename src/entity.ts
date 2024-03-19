import { Session } from './authentication/entities/session.entity';
import { SystemParameter } from './systemparams/entities/systemparam.entity';
import { TaskAssignment } from './task-assignment/entities/task-assignment.entity';
import { Task } from './task/entities/task.entity';
import { User } from './users/entities/users.entity';
import { WorkspaceInvitation } from './workspace-invitation/enitities/workspace-invitation.entity';
import { WorkspaceMember } from './workspace-member/entities/workspace-member.entity';
import { Workspace } from './workspace/entities/workspace.entity';

export const entities = [
  User,
  Session,
  Workspace,
  WorkspaceMember,
  SystemParameter,
  WorkspaceInvitation,
  Task,
  TaskAssignment,
];
