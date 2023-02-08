import { Expose } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';

export class TaskDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: TaskStatus;
}
