export class CreateTodoDto {
  title: string;
  description: string;
  completed: boolean;
  due_time: Date;
  tag_name: string[];
}
