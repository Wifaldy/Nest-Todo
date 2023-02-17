import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { TodoTag } from 'src/todo_tag/entities/todo_tag.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  completed: boolean;

  @Column({
    type: 'date',
  })
  due_time: Date;

  @Column({
    type: 'bigint',
  })
  user_id: number;

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

  @ManyToOne(() => User, (user) => user.todo)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToMany(() => TodoTag, (todo_tag) => todo_tag.todo)
  todo_tag: TodoTag[];
}
