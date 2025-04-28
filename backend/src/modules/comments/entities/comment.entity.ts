import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { v4 } from 'uuid';

@Entity()
export class Comment {
  @PrimaryKey()
  id: string = v4();

  @Property()
  content: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  isDeleted: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Comment, { nullable: true, index: true })
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  replies = new Collection<Comment>(this);

  @OneToMany(() => Notification, (notification) => notification.comment, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  notifications = new Collection<Notification>(this);
}
