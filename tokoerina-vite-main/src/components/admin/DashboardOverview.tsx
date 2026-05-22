import { useMemo, useState, useEffect } from 'react'
import { dashboardAPI, ordersAPI, productsAPI } from '../../services/api'
import { isDessertProduct } from '../../data/groceryProducts'
import {
  Package,
  MessageSquare,
  Zap,
  TrendingUp,
  Eye,
  AlertCircle,
  Loader,
} from 'lucide-react'

interface DashboardData {
  summary: {
    total_products: number
    featured_products: number
    out_of_stock_products: number
    unread_messages: number
  }
  recent_messages: Array<{
    id: string
    name: string
    phone_number: string
    is_read: boolean
    created_at: string
  }>
  visitor_today: number
  visitor_week: number
  top_products: Array<{
    id: string
    name: string
    view_count: number
  }>
}

interface Product {
  id: string
  name: string
  flavor: string
  image_url: string
}

interface AnalyticsData {
  total_visits_period: number
  unique_cities: number
  top_countries: Array<{
    visitor_country: string
    visits: number
  }>
  top_cities: Array<{
    visitor_city: string
    visits: number
  }>
  daily_visits: Array<{
    visit_date: string
    visits: number
  }>
}

interface CustomerOrder {
  id: string
  customer_name: string
  phone: string
  address?: string
  note?: string
  items: Array<{
    name: string
    product_name?: string
    price: number
    quantity: number
  }>
  total: number
  status: string
  created_at: string
}

const normalizeOrders = (data: any): CustomerOrder[] => {
  const orders = data?.data || data || []
  if (!Array.isArray(orders)) return []

  return orders.map((order) => ({
    ...order,
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          ...item,
          name: item.name || item.product_name || 'Produk',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0,
        }))
      : [],
    total: Number(order.total) || 0,
  }))
}

const getOrderStatusStyle = (status: string) => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes('selesai')) {
    return 'bg-green-100 text-green-700'
  }

  return 'bg-yellow-100 text-yellow-700'
}

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderStatusError, setOrderStatusError] = useState<string | null>(null)

  const frequentlyBoughtProducts = useMemo(() => {
    const productMap = new Map(
      products
        .filter((product) => product.name)
        .map((product) => [product.name.toLowerCase(), product])
    )
    const purchaseMap = new Map<
      string,
      {
        name: string
        quantity: number
        revenue: number
        product?: Product
      }
    >()

    customerOrders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        if (!item.name) return
        if (isDessertProduct({ name: item.name })) return

        const key = item.name.toLowerCase()
        const current = purchaseMap.get(key) || {
          name: item.name,
          quantity: 0,
          revenue: 0,
          product: productMap.get(key),
        }

        current.quantity += Number(item.quantity || 0)
        current.revenue += Number(item.price || 0) * Number(item.quantity || 0)
        current.product = current.product || productMap.get(key)
        purchaseMap.set(key, current)
      })
    })

    return Array.from(purchaseMap.values())
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5)
  }, [customerOrders, products])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const ordersRes = await ordersAPI.getOrders({ limit: 20 })
      const groceryOrders = normalizeOrders(ordersRes.data).filter(
        (order: CustomerOrder) =>
          (order.items || []).every(
            (item) => !isDessertProduct({ name: item.name })
          )
      )
      setCustomerOrders(groceryOrders)

      const productsRes = await productsAPI.getPublicProducts({ limit: 100 })
      const productList = productsRes.data.data || []
      setProducts(productList)

      try {
        const dashRes = await dashboardAPI.getDashboard()
        setDashboardData(dashRes.data)
      } catch {
        setDashboardData({
          summary: {
            total_products: productList.length,
            featured_products: productList.filter(
              (product: any) => product.is_featured
            ).length,
            out_of_stock_products: productList.filter(
              (product: any) => product.stock_status === 'out_of_stock'
            ).length,
            unread_messages: 0,
          },
          recent_messages: [],
          visitor_today: 0,
          visitor_week: 0,
          top_products: [],
        })
      }

      try {
        const analyticsRes = await dashboardAPI.getAnalytics(1)
        setAnalyticsData(analyticsRes.data)
      } catch {
        setAnalyticsData(null)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Gagal memuat data produk dan pesanan dashboard'
      )
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderStatusChange = (orderId: string, status: string) => {
    const previousOrders = customerOrders
    const nextOrders = customerOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    )

    setOrderStatusError(null)
    setCustomerOrders(nextOrders)
    ordersAPI.updateOrderStatus(orderId, status).catch((err) => {
      setCustomerOrders(previousOrders)
      setOrderStatusError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Gagal mengubah status pesanan'
      )
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" size={24} />
        <span className="text-lg text-gray-600">Memuat dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Gagal Memuat Dashboard
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const summary = dashboardData?.summary

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Ringkasan lengkap operasional Toko Erina
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="px-6 py-2 bg-sky-800 text-white rounded-lg hover:bg-sky-900 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
        >
          <Zap size={18} />
          Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-sky-800 font-medium mb-1">
                Total Produk
              </p>
              <p className="text-3xl font-bold text-sky-950">
                {summary?.total_products || 0}
              </p>
            </div>
            <Package size={32} className="text-sky-700 opacity-20" />
          </div>
          <div className="text-xs text-sky-700">
            {summary?.featured_products || 0} unggulan
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">
                Stok Habis
              </p>
              <p className="text-3xl font-bold text-red-900">
                {summary?.out_of_stock_products || 0}
              </p>
            </div>
            <AlertCircle size={32} className="text-red-500 opacity-20" />
          </div>
          <div className="text-xs text-red-700">Butuh restok</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Unread Messages */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pesan Belum Dibaca
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.unread_messages || 0}
              </p>
            </div>
            <MessageSquare size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>

        {/* Visitor Today */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pengunjung Hari Ini
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.visitor_today || 0}
              </p>
            </div>
            <Eye size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>

        {/* Visitor This Week */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Pengunjung Minggu Ini
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.visitor_week || 0}
              </p>
            </div>
            <TrendingUp size={32} className="text-gray-400 opacity-40" />
          </div>
        </div>
      </div>

      {/* Customer Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Orders */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Pesanan Konsumen
          </h3>
          {orderStatusError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {orderStatusError}
            </div>
          )}
          <div className="space-y-3">
            {customerOrders.length === 0 ? (
              <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50 text-center">
                <p className="font-semibold text-gray-900">
                  Belum ada pesanan konsumen
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Pesanan yang dibuat dari keranjang akan tampil di sini.
                </p>
              </div>
            ) : (
              customerOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {order.customer_name}
                      </h4>
                      <p className="text-xs text-sky-800 font-semibold">
                        {order.id}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleOrderStatusChange(order.id, e.target.value)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold outline-none ${getOrderStatusStyle(
                        order.status
                      )}`}
                    >
                      <option value="Menunggu Diproses">
                        Menunggu Diproses
                      </option>
                      <option value="Pesanan Selesai">Pesanan Selesai</option>
                    </select>
                  </div>

                  <div className="mb-3 space-y-1 text-sm text-gray-600">
                    <p>{order.phone}</p>
                    {order.address && (
                      <div className="rounded-lg border border-sky-100 bg-white/70 p-3">
                        <p className="mb-1 text-xs font-semibold uppercase text-sky-800">
                          Alamat Pengiriman
                        </p>
                        <p className="leading-relaxed text-gray-700">
                          {order.address}
                        </p>
                      </div>
                    )}
                    {order.note && (
                      <p className="text-xs text-gray-500">
                        Catatan: {order.note}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.quantity} x {item.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          Rp{' '}
                          {(item.price * item.quantity).toLocaleString(
                            'id-ID'
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sky-200">
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="font-bold text-sky-800">
                      Rp {order.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Frequently Bought Products */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Produk yang Sering Dibeli
          </h3>
          <div className="space-y-3">
            {frequentlyBoughtProducts.length === 0 ? (
              <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50 text-center">
                <p className="font-semibold text-gray-900">
                  Belum ada produk yang dibeli
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Data akan dihitung dari pesanan konsumen yang masuk.
                </p>
              </div>
            ) : (
              frequentlyBoughtProducts.map((product, idx) => (
                <div
                  key={product.name}
                  className="p-4 bg-gradient-to-r from-sky-50 to-transparent rounded-xl border-2 border-sky-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-800">
                        <span className="text-sm font-bold text-white">
                          {idx + 1}
                        </span>
                      </div>
                      {product.product?.image_url && (
                        <img
                          src={product.product.image_url}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {product.name}
                        </p>
                        {product.product?.flavor && (
                          <p className="text-xs font-semibold text-sky-700">
                            {product.product.flavor}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-sky-800">
                        {product.quantity} dibeli
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        Rp {product.revenue.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overall Analytics Summary */}
      {analyticsData && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ringkasan Analitik
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Total Kunjungan
                </p>
                <p className="text-4xl font-bold text-purple-900">
                  {analyticsData.total_visits_period}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Kota Unik
                </p>
                <p className="text-4xl font-bold text-indigo-900">
                  {analyticsData.unique_cities}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Visits Trend */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tren Kunjungan Harian
            </h3>
            <div className="space-y-2">
              {analyticsData.daily_visits.slice(-14).map((day, idx) => {
                const maxVisits =
                  Math.max(
                    ...analyticsData.daily_visits.map((d) => d.visits),
                  ) || 1
                const percentage = (day.visits / maxVisits) * 100
                const date = new Date(day.visit_date).toLocaleDateString(
                  'id-ID',
                  { day: 'numeric', month: 'short' },
                )

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-16">
                      {date}
                    </span>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-sky-800 h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-xs font-bold text-white">
                              {day.visits}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {percentage <= 15 && (
                      <span className="text-xs font-semibold text-gray-900 w-6 text-right">
                        {day.visits}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Hari dengan Kunjungan Tertinggi
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {Math.max(
                      ...analyticsData.daily_visits.map((d) => d.visits),
                    )}{' '}
                    visits
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Rata-rata Harian
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {Math.round(
                      analyticsData.daily_visits.reduce(
                        (sum, d) => sum + d.visits,
                        0,
                      ) / analyticsData.daily_visits.length,
                    )}{' '}
                    visits
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Total Hari Dilacak
                  </p>
                  <p className="text-lg font-bold text-sky-800">
                    {analyticsData.daily_visits.length} hari
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




