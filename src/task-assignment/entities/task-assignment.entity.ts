import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'task_assignments' })
export class TaskAssignment {
  @PrimaryColumn('uuid', { name: 'task_id' })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @PrimaryColumn('uuid', { name: 'userId_assigned_to' })
  userIdAssignedTo: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId_assigned_to' })
  userAssignedTo: User;

  @PrimaryColumn('uuid', { name: 'userId_assigned_by' })
  userIdAssignedBy: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId_assigned_by' })
  userAssignedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
