import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/users.entity';
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
    for (const user of users) {
      await workspaceFactory.saveMany(10, { ownerId: user.id });
    }

    // // Seed Tasks
    // const taskFactory = factoryManager.get(Task);
    // for (const workspace of workspaces) {
    //   await taskFactory.saveMany(10, {
    //     workspaceId: workspace.id,
    //     createdBy: workspace.ownerId,
    //   });
    // }
  }
}
