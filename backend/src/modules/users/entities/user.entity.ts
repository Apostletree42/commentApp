import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Comment } from '../../comments/entities/comment.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true, index: true })
  username: string;

  @Property()
  password: string;

  @Property()
  createdAt: Date = new Date();

  @OneToMany(() => Comment, (comment) => comment.author, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  comments = new Collection<Comment>(this);

  @OneToMany(() => Notification, (notification) => notification.recipient, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  notifications = new Collection<Notification>(this);
}
