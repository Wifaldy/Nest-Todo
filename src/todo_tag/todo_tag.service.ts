import { Injectable } from '@nestjs/common';
import { CreateTodoTagDto } from './dto/create-todo_tag.dto';
import { UpdateTodoTagDto } from './dto/update-todo_tag.dto';

@Injectable()
export class TodoTagService {
  create(createTodoTagDto: CreateTodoTagDto) {
    return 'This action adds a new todoTag';
  }

  findAll() {
    return `This action returns all todoTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todoTag`;
  }

  update(id: number, updateTodoTagDto: UpdateTodoTagDto) {
    return `This action updates a #${id} todoTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} todoTag`;
  }
}
