
import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name:"refresh_tokens"})
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    user_id: string;
  
    @Column()
    refresh_token: string;
  
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
