import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkspaceMember } from '../../workspace-member/entities/workspace-member.entity';
import WorkspaceType from 'src/enum/workspace-type.enum';
import { Task } from 'src/task/entities/task.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  owner_id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: WorkspaceType,
    default: WorkspaceType.PERSONAL,
  })
  type: string;

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.workspace,
  )
  public members: WorkspaceMember[];

  @OneToMany(() => Task, (task) => task.workspace)
  public task: Task;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
