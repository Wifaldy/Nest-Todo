/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoTag } from 'src/todo_tag/entities/todo_tag.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoTag, Tag])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule { }
