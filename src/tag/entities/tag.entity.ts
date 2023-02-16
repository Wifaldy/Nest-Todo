import { TodoTag } from 'src/todo_tag/entities/todo_tag.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => TodoTag, (todo_tag) => todo_tag.tag)
  todo_tag: TodoTag;
}
