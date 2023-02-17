import { Todo } from 'src/todo/entities/todo.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @CreateDateColumn({
    type: 'date',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'date',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'date',
    default: null,
  })
  deleted_at: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todo: Todo[];
}
