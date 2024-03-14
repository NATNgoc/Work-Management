import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from 'src/users/entities/users.entity';

export enum WorkspaceMemberRole {
  OWNER = 'owner',
  LEADER = 'leader',
  MEMBER = 'member',
}

@Entity({ name: 'workspace_members' })
export class WorkspaceMember {
  @ManyToOne(() => Workspace, (workspace) => workspace.members)
  public workspace: Workspace;

  @ManyToOne(() => User, (user) => user.workspaceMembers)
  public user: User;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date' })
  updated_at: Date;
}
