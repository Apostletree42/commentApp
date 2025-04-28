import { useState } from 'react'
import { useCreateComment } from '../../api/comments/commentHooks'
import { useQueryClient } from '@tanstack/react-query';
import { COMMENT_CALLS } from '../../api/comments/commentCalls';

interface CommentFormProps {
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

const CommentForm = ({ 
  parentId,
  onSuccess,
  placeholder = 'Start a discussion...' 
}: CommentFormProps) => {
  const [content, setContent] = useState('')
  const createComment = useCreateComment()
  const queryClient = useQueryClient()
  
  const resetForm = () => setContent('')
  
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      console.log("Creating reply to parent:", parentId);
      await createComment.mutateAsync({
        content: content,
        parentId: parentId,
      });
      queryClient.invalidateQueries({ queryKey: COMMENT_CALLS.getComments.getKey() });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: COMMENT_CALLS.getCommentReplies.getKey(parentId) });
      }
      
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        rows={parentId ? 3 : 4}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={createComment.isPending || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createComment.isPending ? 'Posting...' : parentId ? 'Reply' : 'Post'}
        </button>
      </div>
    </form>
  )
}

export default CommentForm