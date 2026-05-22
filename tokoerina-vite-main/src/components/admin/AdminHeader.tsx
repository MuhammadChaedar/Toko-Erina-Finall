import { User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = (user?.full_name || 'Admin Toko Erina').replace(
    /Mealjun/g,
    'Toko Erina',
  )
  const displayEmail = (user?.email || 'admin@tokoerina.com').replace(
    /admin@mealjun\.com/g,
    'admin@tokoerina.com',
  )

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Dashboard Admin Toko Erina
          </h2>
          <p className="text-sm text-gray-600">
            Kelola konten toko sembako Anda
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-900">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">
                {displayEmail}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-800">
              <User size={20} className="text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut
                size={20}
                className="text-gray-600 group-hover:text-red-600"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}




