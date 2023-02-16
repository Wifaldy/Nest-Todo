import { Test, TestingModule } from '@nestjs/testing';
import { TodoTagController } from './todo_tag.controller';
import { TodoTagService } from './todo_tag.service';

describe('TodoTagController', () => {
  let controller: TodoTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoTagController],
      providers: [TodoTagService],
    }).compile();

    controller = module.get<TodoTagController>(TodoTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
