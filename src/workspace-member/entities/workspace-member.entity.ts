import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { User } from 'src/users/entities/users.entity';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

@Entity({ name: 'workspace_members' })
export class WorkspaceMember {
  @PrimaryColumn('uuid', { name: 'workspace_id' })
  workspaceId: string;

  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.members)
  @JoinColumn({ name: 'workspace_id' })
  public workspace: Workspace;

  @ManyToOne(() => User, (user) => user.workspaceMembers)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role: WorkspaceMemberRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
