import { Test, TestingModule } from '@nestjs/testing';
import { TodoTagService } from './todo_tag.service';

describe('TodoTagService', () => {
  let service: TodoTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoTagService],
    }).compile();

    service = module.get<TodoTagService>(TodoTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
