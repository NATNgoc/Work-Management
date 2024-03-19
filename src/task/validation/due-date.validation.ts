import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ name: 'dueDateGreaterThanCurrentDate', async: false })
export class DueDateGreaterThanCurrentDate
  implements ValidatorConstraintInterface
{
  validate(dueDate: Date, args: ValidationArguments) {
    const currentDate = dayjs();

    return currentDate.isBefore(dayjs(dueDate));
  }

  defaultMessage(args: ValidationArguments) {
    return 'Due date must be greater than the current date';
  }
}
