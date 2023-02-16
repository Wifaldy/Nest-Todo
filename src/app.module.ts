/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { Todo } from './todo/entities/todo.entity';
import { TodoTagModule } from './todo_tag/todo_tag.module';
import { TagModule } from './tag/tag.module';
import { TodoTag } from './todo_tag/entities/todo_tag.entity';
import { Tag } from './tag/entities/tag.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'dottodos',
      entities: [User, Todo, TodoTag, Tag],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    TodoModule,
    TodoTagModule,
    TagModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
