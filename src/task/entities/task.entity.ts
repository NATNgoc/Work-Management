import { Exclude } from 'class-transformer';
import TaskStatus from 'src/enum/task-status.enum';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { User } from 'src/users/entities/users.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdUser: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isDone: boolean;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: 'date' })
  dueDate: Date;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.task)
  public assignedTasks: TaskAssignment[];
}
