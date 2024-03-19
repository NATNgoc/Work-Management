import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from '@hapi/joi';
import { GlobalExceptionFilter } from './exceptionFilter/exception-filter';
import { WorkspaceModule } from './workspace/workspace.module';
import { NotificationModule } from './notification/notification.module';
import { SystemparamsModule } from './systemparams/systemparams.module';
import { WorkspaceInvitationModule } from './workspace-invitation/workspace-invitation.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { TaskAssignmentModule } from './task-assignment/task-assignment.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    DatabaseModule,
    AuthenticationModule,
    WorkspaceModule,
    NotificationModule,
    SystemparamsModule,
    WorkspaceInvitationModule,
    WorkspaceMemberModule,
    TaskAssignmentModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
