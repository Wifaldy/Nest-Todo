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

      createTodoDto.tag_name.forEach(async (tag_name) => {
        const findTag = await this.tagRepository.findOne({
          where: { name: tag_name },
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
          tag.name = tag_name
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

  async findAll(user: User) {
    const todos = await this.todoRepository.find({
      where: { user_id: user.id },
      relations: {
        todo_tag: {
          tag: true,
        },
      },
    })
    const extractedTodos = []
    todos.map((todo) => {
      const newTodo = { ...todo, tags_name: [] }

      newTodo.tags_name = todo.todo_tag.map(todo_tag => todo_tag.tag.name)
      delete newTodo.todo_tag
      extractedTodos.push(newTodo)
    })
    return {
      extractedTodos
    }
  }

  async findOne(id: number, user: User) {
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
    return {
      todo
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: User) {
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

    const todoTags = await this.todoTagRepository.find({
      where: {
        todo_id: id
      },
      relations: {
        tag: true
      }
    })

    return {
      todoTags
    }
    // todoTags.map(async (todoTag) => {
    //   await this.todoTagRepository.delete(todoTag.id)
    // }
    // )

    // updateTodoDto.tag_name.forEach(async (tag_name) => {
    //   const findTag = await this.tagRepository.findOne({
    //     where: { name: tag_name },
    //   });
    //   if (findTag) {
    //     const todoTag = new TodoTag();
    //     todoTag.todo_id = todo.id
    //     todoTag.tag_id = findTag.id
    //     todoTag.created_at = new Date()
    //     todoTag.updated_at = new Date()

    //     await this.todoTagRepository.save(todoTag);
    //   }
    //   else {
    //     const tag = new Tag();
    //     tag.name = tag_name
    //     tag.created_at = new Date()
    //     tag.updated_at = new Date()
    //     const createdTag = await this.tagRepository.save(tag);

    //     const todoTag = new TodoTag();
    //     todoTag.todo_id = todo.id
    //     todoTag.tag_id = createdTag.id
    //     todoTag.created_at = new Date()
    //     todoTag.updated_at = new Date()

    //     await this.todoTagRepository.save(todoTag);
    //   }
    // })
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
