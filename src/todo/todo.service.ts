/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tag/entities/tag.entity';
import { TodoTag } from 'src/todo_tag/entities/todo_tag.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(TodoTag)
    private readonly todoTagRepository: Repository<TodoTag>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private dataSource: DataSource
  ) { }

  async create(createTodoDto: CreateTodoDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const todo = new Todo();
      todo.title = createTodoDto.title
      todo.description = createTodoDto.description
      todo.completed = createTodoDto.completed
      todo.due_time = createTodoDto.due_time
      todo.user_id = user.id
      todo.created_at = new Date()
      todo.updated_at = new Date()
      const createdTodo = await this.todoRepository.save(todo);

      await this.creatingTagAndTodoTag(createTodoDto.tag_name, createdTodo)
      await queryRunner.commitTransaction();
      return {
        message: 'Todo created successfully',
      };
    } catch (e) {
      queryRunner.rollbackTransaction();
      console.log(e)
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(user: User, tag: string, completed) {

    const todos = await this.todoRepository.find({
      relations: {
        todo_tag: {
          tag: true,
        },
      },
      where: {
        user_id: user.id,
        todo_tag: {
          tag: {
            name: tag
          }
        },
        completed
      },
    })

    return {
      todos
    }
  }

  async findOne(id: number, user: User) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: id,
      }
    })
    if (!todo) {
      throw new HttpException('Todo not found', 404)
    }
    if (todo.user_id !== user.id) {
      throw new HttpException('Unauthorized', 401)
    }
    return {
      todo
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const todo = await this.todoRepository.findOne({
        where: {
          id: id,
          user_id: user.id
        }
      })
      if (!todo) {
        throw new HttpException('Todo not found', 404)
      }
      if (todo.user_id !== user.id) {
        throw new HttpException('Unauthorized', 401)
      }

      todo.title = updateTodoDto.title || todo.title
      todo.description = updateTodoDto.description || todo.description
      todo.completed = updateTodoDto.completed || todo.completed
      todo.due_time = updateTodoDto.due_time || todo.due_time
      todo.updated_at = new Date()

      await this.todoRepository.save(todo);

      if (updateTodoDto.tag_name.length > 0) {
        const todoTag = await this.todoTagRepository.find({
          where: {
            todo_id: id,
          }
        })
        if (todoTag) {
          todoTag.map(async (todoTag) => {
            await this.todoTagRepository.softDelete(todoTag.id)
          })
        }
        await this.creatingTagAndTodoTag(updateTodoDto.tag_name, todo)
      }
      await queryRunner.commitTransaction();
      return await this.findOne(id, user)
    } catch (e) {
      queryRunner.rollbackTransaction();
      console.log(e)
    } finally {
      await queryRunner.release()
    }
  }

  async creatingTagAndTodoTag(tags_name: string[], createdTodo: Todo) {
    tags_name.forEach(async (tag_name) => {
      const findTag = await this.tagRepository.findOne({
        where: { name: tag_name.toLowerCase() },
      });
      if (findTag) {
        const todoTag = new TodoTag();
        todoTag.todo_id = createdTodo.id
        todoTag.tag_id = findTag.id
        todoTag.created_at = new Date()
        todoTag.updated_at = new Date()

        await this.todoTagRepository.save(todoTag);
      }
      else {
        const tag = new Tag();
        tag.name = tag_name.toLowerCase()
        tag.created_at = new Date()
        tag.updated_at = new Date()
        const createdTag = await this.tagRepository.save(tag);

        const todoTag = new TodoTag();
        todoTag.todo_id = createdTodo.id
        todoTag.tag_id = createdTag.id
        todoTag.created_at = new Date()
        todoTag.updated_at = new Date()

        await this.todoTagRepository.save(todoTag);
      }
    }
    );
  }

  async remove(id: number, user: User) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: id,
      }
    })
    const todoTag = await this.todoTagRepository.find({
      where: {
        todo_id: id,
      }
    })
    if (todoTag) {
      todoTag.map(async (todoTag) => {
        await this.todoTagRepository.softDelete(todoTag.id)
      })
    }

    if (!todo) {
      throw new HttpException('Todo not found', 404)
    }
    if (todo.user_id !== user.id) {
      throw new HttpException('Unauthorized', 401)
    }
    await this.todoRepository.softDelete(id)

    return {
      message: 'Todo deleted successfully'
    }
  }
}
