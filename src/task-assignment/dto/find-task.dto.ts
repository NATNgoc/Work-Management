import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsDate } from 'class-validator';

export class FindTaskDto {
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  userIdAssignedTo?: string;

  @IsOptional()
  @IsUUID()
  userIdAssignedBy?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
