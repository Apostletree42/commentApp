import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Comment App
        </Link>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header