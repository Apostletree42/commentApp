import { useState } from "react";

const CommentEditForm = ({ 
  content, 
  onSave, 
  onCancel, 
  isPending 
}: { 
  content: string; 
  onSave: (content: string) => void; 
  onCancel: () => void; 
  isPending: boolean 
}) => {
  const [editedContent, setEditedContent] = useState(content);

  return (
    <div>
      <textarea
        className="w-full p-2 border rounded mb-2"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={3}
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(editedContent)}
          disabled={isPending}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 border text-sm rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentEditForm;