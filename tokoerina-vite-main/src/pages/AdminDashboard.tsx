import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import DashboardOverview from '../components/admin/DashboardOverview'
import ProductManagement from '../components/admin/ProductManagement'
import AboutManagement from '../components/admin/AboutManagement'
import ContactMessagesManagement from '../components/admin/ContactMessagesManagement'
import SalesInventoryReport from '../components/admin/SalesInventoryReport'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <AdminSidebar />

      <div className="ml-64 w-[calc(100%-256px)] flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="sales-inventory" element={<SalesInventoryReport />} />
            <Route path="about" element={<AboutManagement />} />
            <Route
              path="contact-messages"
              element={<ContactMessagesManagement />}
            />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}




