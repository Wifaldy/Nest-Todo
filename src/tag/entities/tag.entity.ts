import { TodoTag } from 'src/todo_tag/entities/todo_tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

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

  @OneToMany(() => TodoTag, (todo_tag) => todo_tag.tag)
  todo_tag: TodoTag;
}
