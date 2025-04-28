import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { FindCommentDto } from './dto/find-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CommentTreeBuilder } from './comment-tree-builder';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    private readonly commentEm: EntityManager,
    private readonly notificationsService: NotificationsService,
    private readonly commentTreeBuilder: CommentTreeBuilder,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author,
    });

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne(
        createCommentDto.parentId,
      );
      if (!parentComment) {
        throw new NotFoundException(
          `Parent comment with ID ${createCommentDto.parentId} not found`,
        );
      }
      comment.parentComment = parentComment;
    }

    await this.commentEm.transactional(async (em) => {
      await em.persistAndFlush(comment);
      await this.notificationsService.create(comment.id);
    });

    return comment;
  }

  async findAll(queryOptions: FindCommentDto = {}): Promise<{
    comments: Comment[];
    total: number;
    hasMoreReplies: Record<string, number>;
  }> {
    const {
      limit = 10,
      page = 1,
      depth = 0,
      repliesPerLevel = 3,
    } = queryOptions;

    // Find all top comments
    const [comments, total] = await this.commentRepository.findAndCount(
      { parentComment: null, isDeleted: false },
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: { createdAt: 'DESC' },
        populate: ['author'],
      },
    );

    const hasMoreReplies: Record<string, number> = {};

    if (depth > 0) {
      await this.commentTreeBuilder.loadReplies(
        comments,
        depth,
        repliesPerLevel,
      );

      // Calculate additional replies for each comment
      await Promise.all(
        comments.map(async (comment) => {
          const totalReplies = await this.commentTreeBuilder.countTotalReplies(
            comment.id,
          );
          const loadedReplies =
            this.commentTreeBuilder.countLoadedReplies(comment);
          if (totalReplies > loadedReplies) {
            hasMoreReplies[comment.id] = totalReplies - loadedReplies;
          }
        }),
      );
    } else {
      // If depth is 0, just count replies for each comment
      await Promise.all(
        comments.map(async (comment) => {
          const replyCount = await this.commentRepository.count({
            parentComment: comment,
            isDeleted: false,
          });

          if (replyCount > 0) {
            hasMoreReplies[comment.id] = replyCount;
          }
        }),
      );
    }

    return { comments, total, hasMoreReplies };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { id, isDeleted: false },
      {
        populate: ['author'],
      },
    );

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Populate replies and their authors recursively
    await this.commentTreeBuilder.loadReplies([comment], 3, 5);

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    currentUser: User,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { id, isDeleted: false },
      { populate: ['author'] },
    );

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.author.id !== currentUser.id) {
      throw new BadRequestException('You can only edit your own comments');
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.createdAt < fifteenMinutesAgo) {
      throw new BadRequestException(
        'Comments can only be edited within 15 minutes of posting',
      );
    }

    comment.content = updateCommentDto.content;
    await this.commentEm.flush();

    return comment;
  }

  async remove(id: string, currentUser: User): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { id, isDeleted: false },
      { populate: ['author'] },
    );

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.author.id !== currentUser.id) {
      throw new BadRequestException('You can only delete your own comments');
    }

    // soft delet
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await this.commentEm.flush();

    return comment;
  }

  async restore(id: string, currentUser: User): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { id, isDeleted: true },
      { populate: ['author'] },
    );

    if (!comment) {
      throw new NotFoundException(`Deleted comment with ID ${id} not found`);
    }

    if (comment.author.id !== currentUser.id) {
      throw new BadRequestException('You can only restore your own comments');
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.deletedAt && comment.deletedAt < fifteenMinutesAgo) {
      throw new BadRequestException(
        'Comments can only be restored within 15 minutes of deletion',
      );
    }

    comment.isDeleted = false;
    comment.deletedAt = null;
    await this.commentEm.flush();

    return comment;
  }

  async findCommentReplies(id: string): Promise<Comment[]> {
    const comment = await this.commentRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const replies = await this.commentRepository.find(
      { parentComment: comment, isDeleted: false },
      {
        populate: ['author'],
        orderBy: { createdAt: 'DESC' },
      },
    );

    if (replies.length > 0) {
      await this.commentTreeBuilder.loadReplies(replies, 2, 5);
    }

    return replies;
  }

  // method to load the complete reply tree
  async loadCompleteReplyTree(commentId: string): Promise<Comment[]> {
    const comment = await this.commentRepository.findOne({ id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const directReplies = await this.commentRepository.find(
      { parentComment: comment, isDeleted: false },
      { populate: ['author'], orderBy: { createdAt: 'DESC' } },
    );

    for (const reply of directReplies) {
      await this.commentTreeBuilder.populateNestedReplies(reply);
    }

    return directReplies;
  }
}
