import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import TaskStatus from 'src/enum/task-status.enum';
import { Task } from 'src/task/entities/task.entity';

export const TaskFactory = setSeederFactory(Task, (faker: Faker) => {
  const task = new Task();
  task.title = faker.lorem.sentence();
  task.description = faker.lorem.paragraph();
  task.status = faker.helpers.arrayElement(Object.values(TaskStatus));
  task.dueDate = faker.date.future();
  task.isDone = faker.datatype.boolean();
  return task;
});
