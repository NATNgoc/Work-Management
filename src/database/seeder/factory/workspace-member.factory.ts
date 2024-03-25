import { setSeederFactory } from 'typeorm-extension';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Faker } from '@faker-js/faker';

export const WorkspaceMemberFactory = setSeederFactory(
  WorkspaceMember,
  (faker: Faker) => {
    const workspaceMember = new WorkspaceMember();
    workspaceMember.role = WorkspaceMemberRole.OWNER;
    return workspaceMember;
  },
);
