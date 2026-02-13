// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('yur') // 'yur' is the table name
export class Users {
  
  @PrimaryGeneratedColumn() // Auto-increment ID
  id: number;

  @Column() // Simple column
  name: string;

  @Column()
  email: string;

}
