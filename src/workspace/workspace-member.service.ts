import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workSpaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  create() {}

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
