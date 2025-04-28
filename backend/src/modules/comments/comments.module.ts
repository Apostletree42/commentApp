import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommentTreeBuilder } from './comment-tree-builder';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: ['Comment'] }),
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentTreeBuilder],
  exports: [CommentsService],
})
export class CommentsModule {}
