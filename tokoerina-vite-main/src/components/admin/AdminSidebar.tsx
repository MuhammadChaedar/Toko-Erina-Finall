import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  FileSpreadsheet,
  Info,
  Mail,
} from 'lucide-react'

export default function AdminSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingBag, label: 'Produk', path: '/admin/products' },
    {
      icon: FileSpreadsheet,
      label: 'Inventaris Penjualan',
      path: '/admin/sales-inventory',
    },
    { icon: Info, label: 'Tentang', path: '/admin/about' },
    { icon: Mail, label: 'Pesan Kontak', path: '/admin/contact-messages' },
  ]

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full h-[100vh] w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <img
            src="/toko-erina-logo.svg"
            alt="Logo Toko Erina"
            className="h-12 w-12 rounded-xl border border-sky-100 bg-sky-50 object-contain p-1"
          />
          <div>
            <h1 className="text-xl font-bold tracking-wide text-sky-900">
              Toko Erina
            </h1>
            <p className="mt-1 text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-800'
                  : 'text-gray-700 hover:bg-slate-50 hover:text-sky-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}




