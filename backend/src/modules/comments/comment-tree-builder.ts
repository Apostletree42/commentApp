import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentTreeBuilder {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  async loadReplies(
    comments: Comment[],
    depth: number,
    repliesPerLevel: number = 3,
  ): Promise<void> {
    if (depth <= 0 || comments.length === 0) return;

    await this.commentRepository.populate(comments, [
      'replies',
      'replies.author',
    ]);

    for (const comment of comments) {
      const validReplies = comment.replies
        .getItems()
        .filter((reply) => !reply.isDeleted);

      const sortedReplies = validReplies.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );

      const limitedReplies = sortedReplies.slice(0, repliesPerLevel);

      comment.replies.removeAll();
      limitedReplies.forEach((reply) => comment.replies.add(reply));

      await this.loadReplies(limitedReplies, depth - 1, repliesPerLevel);
    }
  }

  async populateNestedReplies(comment: Comment): Promise<void> {
    await this.commentRepository.populate(comment, [
      'replies',
      'replies.author',
    ]);

    // If the comment has replies, recursively populate each reply's replies
    if (comment.replies && comment.replies.isInitialized()) {
      const nestedReplies = comment.replies.getItems();

      const validReplies = nestedReplies.filter((reply) => !reply.isDeleted);

      for (const reply of validReplies) {
        await this.populateNestedReplies(reply);
      }

      comment.replies.removeAll();
      validReplies.forEach((reply) => comment.replies.add(reply));
    }
  }

  async countTotalReplies(commentId: string): Promise<number> {
    const allReplies = await this.commentRepository.find({
      $or: [
        { parentComment: { id: commentId } },
        { parentComment: { parentComment: { id: commentId } } },
      ],
      isDeleted: false,
    });

    return allReplies.length;
  }

  // Helper to count loaded replies in the current object graph
  countLoadedReplies(comment: Comment): number {
    if (!comment.replies.isInitialized()) {
      return 0;
    }

    const replies = comment.replies.getItems();
    let count = replies.length;

    for (const reply of replies) {
      count += this.countLoadedReplies(reply);
    }

    return count;
  }
}
