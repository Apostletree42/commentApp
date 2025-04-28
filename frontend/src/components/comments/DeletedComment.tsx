const DeletedComment = ({ 
  isRestorable, 
  onRestore 
}: { 
  isRestorable: boolean; 
  onRestore: () => void 
}) => (
  <>
    <p className="text-gray-500 italic">This comment has been deleted.</p>
    {isRestorable && (
      <button
        onClick={onRestore}
        className="text-sm text-blue-600 hover:text-blue-800 mt-2"
      >
        Restore comment
      </button>
    )}
  </>
);

export default DeletedComment;