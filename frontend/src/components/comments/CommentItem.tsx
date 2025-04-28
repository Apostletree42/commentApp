/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import { Comment } from '../../api/comments/commentCalls'
import { useDeleteComment, useRestoreComment, useUpdateComment, useComment } from '../../api/comments/commentHooks'
import CommentList from './CommentList'
import CommentEditForm from './CommentEditForm'
import DeletedComment from './DeletedComment'
import ActiveComment from './ActiveComment'

interface CommentItemProps {
  comment: Comment | string;
  level: number;
  hasMoreReplies: number;
}

const CommentItem = ({ comment, level }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { data: loadedComment, isLoading } = typeof comment === 'string' 
    ? useComment(comment)
    : { data: undefined, isLoading: false };
  const commentToUse = typeof comment === 'string' ? loadedComment : comment;
  
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const restoreComment = useRestoreComment();

  useEffect(() => {
    if (commentToUse?.content) {
      setEditedContent(commentToUse.content);
    }
  }, [commentToUse]);

  const isEditable = () => {
    if (!commentToUse || typeof commentToUse === 'string') return false;
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return new Date(commentToUse.createdAt) > fifteenMinutesAgo;
  };

  const isRestorable = () => {
    if (!commentToUse || typeof commentToUse === 'string' || !commentToUse.deletedAt) return false;
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return new Date(commentToUse.deletedAt) > fifteenMinutesAgo;
  };

  const handleEdit = (newContent: string) => {
    if (!isEditable() || !commentToUse || typeof commentToUse === 'string') return;
    
    updateComment.mutate({
      id: commentToUse.id,
      data: { content: newContent }
    }, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (error) => {
        console.error('Failed to update comment:', error);
      }
    });
  };
  
  const handleDelete = async () => {
    if (!commentToUse || typeof commentToUse === 'string') return;
    try {
      await deleteComment.mutateAsync(commentToUse.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };
  
  const handleRestore = async () => {
    if (!commentToUse || typeof commentToUse === 'string') return;
    try {
      await restoreComment.mutateAsync(commentToUse.id);
    } catch (error) {
      console.error('Failed to restore comment:', error);
    }
  };

  const toggleReplyForm = () => setShowReplyForm(!showReplyForm);

  if (typeof comment === 'string' && isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-100">
        <p className="text-gray-500 italic">Loading comment {comment.substring(0, 6)}...</p>
      </div>
    );
  }

  if (!commentToUse || typeof commentToUse === 'string') {
    return (
      <div className="p-4 border rounded-lg bg-red-100">
        <p className="text-red-500 italic">Failed to load comment</p>
      </div>
    );
  }

  // Margin calculation for nesting
  const marginClass = `ml-${Math.min(level * 4, 16)}`;
  const borderClass = level > 0 ? 'border-l-2 border-gray-200 pl-4' : '';
  const backgroundClass = commentToUse.isDeleted ? 'bg-gray-100' : 'bg-white';

  return (
    <div className={`${marginClass} ${borderClass}`}>
      <div className={`p-4 border rounded-lg ${backgroundClass}`}>
        {commentToUse.isDeleted ? (
          <DeletedComment 
            isRestorable={isRestorable()} 
            onRestore={handleRestore} 
          />
        ) : (
          <ActiveComment
            comment={commentToUse}
            isEditing={isEditing}
            isEditable={isEditable()}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            onToggleReply={toggleReplyForm}
            showReplyForm={showReplyForm}
            editComponent={
              <CommentEditForm
                content={editedContent}
                onSave={handleEdit}
                onCancel={() => {
                  setIsEditing(false);
                  setEditedContent(commentToUse.content);
                }}
                isPending={updateComment.isPending}
              />
            }
          />
        )}
      </div>
      
      {!commentToUse.isDeleted && 
       commentToUse.replies && 
       Array.isArray(commentToUse.replies) && 
       commentToUse.replies.length > 0 && (
        <div className="mt-4">
          <CommentList 
            comments={commentToUse.replies} 
            hasMoreReplies={{}} 
            level={level + 1} 
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;