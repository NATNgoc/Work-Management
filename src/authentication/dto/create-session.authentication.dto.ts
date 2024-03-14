import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateDateColumn, PrimaryColumn } from 'typeorm';

export class CreateSessionDto {
  @PrimaryColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsDate()
  expiredAt: Date;

  @IsDate()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
}

export default CreateSessionDto;
