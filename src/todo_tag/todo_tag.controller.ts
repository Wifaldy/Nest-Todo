import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoTagService } from './todo_tag.service';
import { CreateTodoTagDto } from './dto/create-todo_tag.dto';
import { UpdateTodoTagDto } from './dto/update-todo_tag.dto';

@Controller('todo-tag')
export class TodoTagController {
  constructor(private readonly todoTagService: TodoTagService) {}

  @Post()
  create(@Body() createTodoTagDto: CreateTodoTagDto) {
    return this.todoTagService.create(createTodoTagDto);
  }

  @Get()
  findAll() {
    return this.todoTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoTagDto: UpdateTodoTagDto) {
    return this.todoTagService.update(+id, updateTodoTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoTagService.remove(+id);
  }
}
