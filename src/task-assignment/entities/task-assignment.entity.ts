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

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @PrimaryColumn('uuid', { name: 'userId_assigned_to' })
  userIdAssignedTo: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId_assigned_to' })
  userAssignedTo: User;

  @PrimaryColumn('uuid', { name: 'userId_assigned_by' })
  userIdAssignedBy: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId_assigned_by' })
  userAssignedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
