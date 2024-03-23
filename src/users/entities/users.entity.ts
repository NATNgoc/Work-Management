import { Exclude } from 'class-transformer';
import UserRole from 'src/enum/user-role.enum';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { Task } from 'src/task/entities/task.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Exclude()
  role: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  public workspaceMembers: WorkspaceMember[];

  @OneToMany(() => Task, (task: Task) => task.createdUser)
  public task: Task[];

  @OneToMany(
    () => TaskAssignment,
    (taskAssignment) => taskAssignment.userAssignedTo,
  )
  public assignedTasks: TaskAssignment[];

  @OneToMany(
    () => TaskAssignment,
    (taskAssignment) => taskAssignment.userAssignedBy,
  )
  public assignedTasksByUser: TaskAssignment[];

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  public workspaces: Workspace[];
}
