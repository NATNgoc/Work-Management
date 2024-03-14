import { Session } from './authentication/entities/session.entity';
import { SystemParameter } from './systemparams/entities/systemparam.entity';
import { User } from './users/entities/users.entity';
import { WorkspaceMember } from './workspace/entities/workspace-member.entity';
import { Workspace } from './workspace/entities/workspace.entity';

export const entities = [
  User,
  Session,
  Workspace,
  WorkspaceMember,
  SystemParameter,
];
