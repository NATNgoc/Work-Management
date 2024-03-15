import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkspaceMember } from './workspace-member.entity';

export enum WorkspaceType {
  PERSONAL = 'personal',
  TEAMWORK = 'teamwork',
}

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
