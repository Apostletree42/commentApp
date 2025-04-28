import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationEventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitNotificationCreated(notification: Notification): void {
    console.log(
      `Emitting notification.created.${notification.recipient.id}`,
      notification,
    );
    this.eventEmitter.emit(
      `notification.created.${notification.recipient.id}`,
      notification,
    );
  }
}
