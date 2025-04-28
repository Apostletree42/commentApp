import { useComment } from '../../api/comments/commentHooks';
import CommentItem from './CommentItem';

interface CommentItemLoaderProps {
  commentId: string;
  level: number;
}

const CommentItemLoader = ({ commentId, level }: CommentItemLoaderProps) => {
  const { data: comment, isLoading, error } = useComment(commentId);
  
  if (isLoading) {
    return (
      <div className={`ml-${Math.min(level * 4, 16)} ${level > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-gray-500 italic">Loading comment {commentId.substring(0, 6)}...</p>
        </div>
      </div>
    );
  }
  
  if (error || !comment) {
    return (
      <div className={`ml-${Math.min(level * 4, 16)} ${level > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="p-4 border rounded-lg bg-red-100">
          <p className="text-red-500 italic">Failed to load comment {commentId.substring(0, 6)}</p>
        </div>
      </div>
    );
  }
  return (
    <CommentItem 
      comment={comment}
      level={level}
      hasMoreReplies={0}
    />
  );
};

export default CommentItemLoader;