import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SseController } from './sse.controller';
import { NotificationEventsService } from './notification-events.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: ['Notification', 'User', 'Comment'],
    }),
    JwtModule.register({
      secret: 'meowMeow',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [NotificationsController, SseController],
  providers: [NotificationsService, NotificationEventsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
