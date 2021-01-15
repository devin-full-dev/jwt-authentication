import { User } from './User';
import { 
  Entity, 
  Column, 
  ManyToOne, 
  UpdateDateColumn, 
  CreateDateColumn, 
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(type => User, user => user.refreshToken)
  user: User 
  
  @Column()
  jwtid: string;

  @Column({default: false})
  used: boolean; 
  
  @Column({default: false})
  invalidated: boolean; 
  
  @Column()
  expiryDate: Date;
  
  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

}