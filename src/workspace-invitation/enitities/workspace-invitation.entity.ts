import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { User } from 'src/users/entities/users.entity';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

@Entity({ name: 'workspace_invitations' })
export class WorkspaceInvitation {
  @PrimaryColumn('uuid', { name: 'workspace_id' })
  workspaceId: string;

  @PrimaryColumn('uuid', { name: 'inviting_user_id' })
  invitingUserId: string;

  @PrimaryColumn('uuid', { name: 'invited_user_id' })
  invitedUserId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  @JoinColumn({ name: 'workspace_id' })
  public workspace: Workspace;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'inviting_user_id' })
  public invitingUser: User;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'invited_user_id' })
  public invitedUser: User;

  @Column({
    type: 'enum',
    enum: WorkspaceInvitationStatus,
    default: WorkspaceInvitationStatus.PENDING,
  })
  status: WorkspaceInvitationStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
