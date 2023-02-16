import { Tag } from 'src/tag/entities/tag.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class TodoTag {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @Column({
    type: 'bigint',
  })
  todo_id: number;

  @Column({
    type: 'bigint',
  })
  tag_id: string;

  @Column({
    type: 'date',
  })
  created_at: Date;

  @Column({
    type: 'date',
  })
  updated_at: Date;

  @Column({
    type: 'date',
    default: null,
  })
  deleted_at: Date;

  @ManyToOne(() => Todo, (todo) => todo.todo_tag)
  @JoinColumn({
    name: 'todo_id',
  })
  todo: Todo;

  @ManyToOne(() => Tag, (tag) => tag.todo_tag)
  @JoinColumn({
    name: 'tag_id',
  })
  tag: Tag;
}
