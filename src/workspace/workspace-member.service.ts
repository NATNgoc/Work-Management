import { ConflictException, Injectable } from '@nestjs/common';
import {
  WorkspaceMember,
  WorkspaceMemberRole,
} from './entities/workspace-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workSpaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async create(
    createWorkspaceMemberData: CreateWorkspaceMemberDto,
  ): Promise<WorkspaceMember | null> {
    const existedOwner = await this.workSpaceMemberRepository.count({
      where: {
        role: WorkspaceMemberRole.OWNER,
        workspaceId: createWorkspaceMemberData.workspaceId,
      },
    });

    if (
      existedOwner > 0 &&
      createWorkspaceMemberData.role == WorkspaceMemberRole.OWNER
    ) {
      throw new ConflictException('Owner of this workspace already');
    }

    const result = await this.workSpaceMemberRepository.create({
      workspaceId: createWorkspaceMemberData.workspaceId,
      userId: createWorkspaceMemberData.userId,
      role: createWorkspaceMemberData.role,
    });
    return await this.workSpaceMemberRepository.save(result);
  }

  async checkWithWorkSpaceRoleAndUserId(
    workSpaceId: string,
    userId: string,
    role: WorkspaceMemberRole,
  ): Promise<boolean> {
    return (
      (await this.workSpaceMemberRepository.countBy({
        userId: userId,
        role: role,
        workspaceId: workSpaceId,
      })) == 1
    );
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update() {}

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
