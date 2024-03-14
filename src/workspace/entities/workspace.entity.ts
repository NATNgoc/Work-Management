import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date' })
  updated_at: Date;
}
