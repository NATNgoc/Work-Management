import { Faker } from '@faker-js/faker';
import { User } from 'src/users/entities/users.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = 'hashed_password';
  user.role = faker.helpers.arrayElement(['admin', 'user']);
  return user;
});
