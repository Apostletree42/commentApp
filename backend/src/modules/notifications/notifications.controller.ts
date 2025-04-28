import { Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FindNotificationDto } from './dto/find-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() findNotificationDto: FindNotificationDto,
  ) {
    return this.notificationsService.findAll(user.id, findNotificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('read-all')
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
