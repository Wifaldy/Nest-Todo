import { Module } from '@nestjs/common';
import { TodoTagService } from './todo_tag.service';
import { TodoTagController } from './todo_tag.controller';

@Module({
  controllers: [TodoTagController],
  providers: [TodoTagService]
})
export class TodoTagModule {}
