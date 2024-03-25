import { ConfigKey } from 'src/common/constaints';
import { SystemParameter } from 'src/systemparams/entities/systemparam.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/users.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Seed Users
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(100);

    // Seed Workspaces
    const workspaceFactory = factoryManager.get(Workspace);
    const workspaceMemberFactory = factoryManager.get(WorkspaceMember);
    const finalWorkSpaces: Array<Workspace> = [];
    for (const user of users) {
      const workspaces = await workspaceFactory.saveMany(10, {
        owner_id: user.id,
      });
      workspaces.forEach(async (workspace) => {
        finalWorkSpaces.push(workspace);
        const result = await workspaceMemberFactory.save({
          workspaceId: workspace.id,
          userId: user.id,
        });
      });
    }

    // Seed Tasks
    const taskFactory = factoryManager.get(Task);
    for (const workspace of finalWorkSpaces) {
      await taskFactory.saveMany(10, {
        workspace_id: workspace.id,
        created_by: workspace.owner_id,
      });
    }

    const systemparamsFactory = factoryManager.get(SystemParameter);
    await systemparamsFactory.save({
      id: ConfigKey.MAXIMUM_MEMBERS_PER_WORKSPACE,
      description: 'Số lượng thành viên tối đa trên một workspace',
      value: {
        value: '50',
      },
    });
    await systemparamsFactory.save({
      id: ConfigKey.MAXIMUM_WORKSPACES_PER_USER,
      description: 'Số lượng không gian làm việc tối đa trên một user',
      value: {
        value: '20',
      },
    });
  }
}
