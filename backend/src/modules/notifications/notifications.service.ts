import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { FindNotificationDto } from './dto/find-notification.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotificationEventsService } from './notification-events.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: EntityRepository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    private readonly em: EntityManager,
    private readonly notificationEventsService: NotificationEventsService,
  ) {}

  async create(commentId: string): Promise<Notification | null> {
    const comment = await this.commentRepository.findOne(
      { id: commentId },
      { populate: ['author', 'parentComment', 'parentComment.author'] },
    );

    if (!comment || !comment.parentComment) {
      return null;
    }

    if (comment.author.id === comment.parentComment.author.id) {
      return null;
    }

    const notification = this.notificationRepository.create({
      recipient: comment.parentComment.author,
      comment,
    });

    await this.em.persistAndFlush(notification);

    if (notification) {
      this.notificationEventsService.emitNotificationCreated(notification);
    }
    return notification;
  }

  async findAll(
    userId: string,
    options: FindNotificationDto = {},
  ): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    const { limit = 10, page = 1, isRead } = options;

    const whereOptions: any = { recipient: { id: userId } };

    if (isRead !== undefined) {
      whereOptions.isRead = isRead;
    }

    const [notifications, total] =
      await this.notificationRepository.findAndCount(whereOptions, {
        limit,
        offset: (page - 1) * limit,
        orderBy: { createdAt: 'DESC' },
        populate: ['comment', 'comment.author'],
      });

    return { notifications, total };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      id,
      recipient: { id: userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    notification.isRead = true;
    await this.em.flush();

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.em.nativeUpdate(
      Notification,
      { recipient: user, isRead: false },
      { isRead: true },
    );
  }
}
