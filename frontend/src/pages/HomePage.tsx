import { useState } from 'react'
import { useComments } from '../api/comments/commentHooks'
import CommentList from '../components/comments/CommentList'
import CommentForm from '../components/comments/CommentForm'

const HomePage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch } = useComments({ 
    page, 
    limit: 10,
    depth: 5,
    repliesPerLevel: 100
  });
  if (error) {
    console.error("Error loading comments:", error);
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading discussions...</div>
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Error loading discussions</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Start a Discussion</h2>
        <CommentForm />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Discussions</h2>
        
        {data?.comments && data.comments.length > 0 ? (
          <>
            <CommentList 
              comments={data.comments} 
              hasMoreReplies={data.hasMoreReplies || {}} 
              level={0}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="self-center">
                Page {page} of {Math.ceil(data.total / 10)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data.total || page >= Math.ceil(data.total / 10)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No discussions yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage