import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemparamDto } from './create-systemparam.dto';

export class UpdateSystemparamDto extends PartialType(CreateSystemparamDto) {}
