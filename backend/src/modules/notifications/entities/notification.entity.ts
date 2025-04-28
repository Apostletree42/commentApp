import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { v4 } from 'uuid';

@Entity()
export class Notification {
  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt: Date = new Date();

  @Property({ index: true })
  isRead: boolean = false;

  @ManyToOne(() => User, { index: true })
  recipient: User;

  @ManyToOne(() => Comment, {
    deleteRule: 'cascade',
  })
  comment: Comment;
}
