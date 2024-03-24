import { Faker } from '@faker-js/faker';
import WorkspaceType from 'src/enum/workspace-type.enum';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { setSeederFactory } from 'typeorm-extension';

export const WorkspaceFactory = setSeederFactory(Workspace, (faker: Faker) => {
  const workspace = new Workspace();
  workspace.name = faker.company.name();
  workspace.description = faker.company.catchPhrase();
  workspace.type = faker.helpers.arrayElement(Object.values(WorkspaceType));
  return workspace;
});
