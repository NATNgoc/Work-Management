import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


export class CreateSessionDto {
    @PrimaryColumn('uuid')
    id: string

    @IsNotEmpty()
    @IsString()
    user_id: string

    @IsDate()
    expired_at: Date

    @IsDate()
    @CreateDateColumn({ type: 'timestamp' })
    create_at: Date
  }
  
  export default CreateSessionDto;