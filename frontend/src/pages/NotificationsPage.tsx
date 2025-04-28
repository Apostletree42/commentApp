import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../api/notifications/notificationHooks'
import { formatDistanceToNow } from 'date-fns'

const NotificationsPage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useNotifications({ 
    page, 
    limit: 10 
  })
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  
  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id)
  }
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Notifications</h1>
        
        <button
          onClick={handleMarkAllAsRead}
          disabled={markAllAsRead.isPending}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">Loading notifications...</div>
      ) : data?.notifications && data.notifications.length > 0 ? (
        <div className="space-y-4">
          {data.notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-800">
                    <span className="font-medium">{notification.comment.author.username}</span> replied to your comment
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "{notification.comment.content.substring(0, 100)}{notification.comment.content.length > 100 ? '...' : ''}"
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsRead.isPending}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                  <Link 
                    to={`/?comment=${notification.comment.id}`} 
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View comment
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
              disabled={page >= Math.ceil(data.total / 10)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No notifications yet.
        </div>
      )}
    </div>
  )
}

export default NotificationsPage