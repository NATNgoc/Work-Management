import { Faker } from '@faker-js/faker';
import { SystemParameter } from 'src/systemparams/entities/systemparam.entity';
import { setSeederFactory } from 'typeorm-extension';

export const SystemParamFactory = setSeederFactory(
  SystemParameter,
  (faker: Faker) => {
    const systemParameter = new SystemParameter();
    return systemParameter;
  },
);
