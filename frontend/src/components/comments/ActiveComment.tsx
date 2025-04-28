import { formatRelativeTime } from "../../utils/dateFormat";
import CommentForm from "./CommentForm";
import { Comment } from '../../api/comments/commentCalls'

const ActiveComment = ({ 
  comment, 
  isEditing, 
  isEditable,
  onEdit, 
  onDelete,
  onToggleReply,
  showReplyForm,
  editComponent
}: { 
  comment: Comment;
  isEditing: boolean;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleReply: () => void;
  showReplyForm: boolean;
  editComponent: React.ReactNode;
}) => (
  <>
    <div className="flex justify-between mb-2">
      <div className="font-medium">{comment.author?.username || 'Unknown user'}</div>
      <div className="text-sm text-gray-500">
        {formatRelativeTime(comment.createdAt)}
      </div>
    </div>
    
    {isEditing ? (
      editComponent
    ) : (
      <div className="mb-2">
        <p className="text-gray-900">{comment.content}</p>
      </div>
    )}
    
    <div className="flex space-x-4 text-sm">
      <button
        onClick={onToggleReply}
        className="text-blue-600 hover:text-blue-800"
      >
        Reply
      </button>
      
      {isEditable && (
        <>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </>
      )}
    </div>
    
    {showReplyForm && (
      <div className="mt-3">
        <CommentForm
          parentId={comment.id}
          onSuccess={onToggleReply}
          placeholder="Write a reply..."
        />
      </div>
    )}
  </>
);

export default ActiveComment;