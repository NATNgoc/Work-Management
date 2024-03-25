import { Faker } from '@faker-js/faker';
import { User } from 'src/users/entities/users.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  user.password =
    '$argon2id$v=19$m=65536,t=3,p=4$vxUgsyfDaDrG2wQyId/pAQ$yLpTdSnWA5aEu8pxiqi70iNhrBa3QAlDb7MnJKkHVGQ';
  user.role = faker.helpers.arrayElement(['admin', 'user']);
  return user;
});
