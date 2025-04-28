import { Controller, Sse, Query, Req } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

interface NotificationEvent {
  data: string;
}

@Controller('sse')
export class SseController {
  constructor(
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Sse('notifications')
  async subscribeToNotifications(
    @Query('token') token: string,
    @Req() req: Request,
  ): Promise<Observable<NotificationEvent>> {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new Error('User not found');
      }

      return new Observable((observer) => {
        const listener = (data) => {
          observer.next({ data: JSON.stringify(data) });
        };

        const eventName = `notification.created.${user.id}`;
        console.log(`Subscribing to event: ${eventName}`);
        this.eventEmitter.on(eventName, listener);

        observer.next({
          data: JSON.stringify({ type: 'connection', status: 'established' }),
        });

        return () => {
          console.log(`Unsubscribing from event: ${eventName}`);
          this.eventEmitter.removeListener(eventName, listener);
        };
      });
    } catch (error) {
      console.error('SSE Auth Error:', error);
      throw new Error('Authentication failed');
    }
  }
}
