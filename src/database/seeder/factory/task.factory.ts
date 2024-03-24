import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import TaskStatus from 'src/enum/task-status.enum';
import { Task } from 'src/task/entities/task.entity';

export const TaskFactory = setSeederFactory(
  Task,
  (faker: Faker, context: { workspaceId: string; createdBy: string }) => {
    console.log(context);
    const task = new Task();
    task.title = faker.lorem.sentence();
    task.description = faker.lorem.paragraph();
    task.status = faker.helpers.arrayElement(Object.values(TaskStatus));
    task.dueDate = faker.date.future();
    task.workspaceId = context.workspaceId;
    task.createdBy = context.createdBy;
    return task;
  },
);
