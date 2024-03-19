import { Exclude } from 'class-transformer';
import { Session } from 'src/authentication/entities/session.entity';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { Task } from 'src/task/entities/task.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
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

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  public workspaceMembers: WorkspaceMember[];

  @OneToMany(() => Session, (session: Session) => session.user)
  public sessions: Session[];

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
}
