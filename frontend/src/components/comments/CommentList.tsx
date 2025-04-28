import { useMemo } from 'react';
import { Comment } from '../../api/comments/commentCalls'
import CommentItem from './CommentItem'
import CommentItemLoader from './CommentItemLoader';

interface CommentListProps {
  comments: (Comment | string)[];
  hasMoreReplies: Record<string, number>;
  level?: number;
  isLoading?: boolean;
}

const CommentList = ({ 
  comments, 
  hasMoreReplies,
  level = 0,
  isLoading = false
}: CommentListProps) => {
  const processedComments = useMemo(() => {
    if (!comments || comments.length === 0) {
      return [];
    }

    return comments.map((comment, index) => {
      if (typeof comment === 'string') {
        return (
          <CommentItemLoader 
            key={`${comment}-${index}`}
            commentId={comment}
            level={level}
          />
        );
      }
      return (
        <CommentItem 
          key={comment.id}
          comment={comment} 
          level={level}
          hasMoreReplies={hasMoreReplies[comment.id] || 0}
        />
      );
    });
  }, [comments, level, hasMoreReplies]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-gray-500">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No comments found</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(comments)) {
    console.error('Comments is not an array:', comments);
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-red-50">
          <p className="text-red-500">Error: Invalid comment data (not an array)</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {processedComments}
    </div>
  );
}

export default CommentList;