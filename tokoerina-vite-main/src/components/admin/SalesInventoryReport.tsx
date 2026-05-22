import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  Download,
  FileSpreadsheet,
  Loader,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { salesReportAPI } from '../../services/api'

interface CustomerOrder {
  id: string
  customer_name: string
  phone: string
  address?: string
  note?: string
  items: Array<{
    id?: string | number
    name: string
    price: number
    quantity: number
  }>
  subtotal?: number
  shipping_fee?: number
  total: number
  status: string
  created_at: string
}

interface ProductSalesSummary {
  name: string
  quantity: number
  revenue: number
}

interface SalesReportData {
  summary?: {
    total_orders?: number
    completed_orders?: number
    items_sold?: number
    total_revenue?: number
    average_order_value?: number
  }
  orders: CustomerOrder[]
  products: ProductSalesSummary[]
}

const formatCurrency = (value: number) =>
  `Rp ${value.toLocaleString('id-ID')}`

const getCurrentMonthValue = () => new Date().toISOString().slice(0, 7)

const getMonthLabel = (monthValue: string) => {
  const [year, month] = monthValue.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

const escapeHtml = (value: string | number | undefined) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const normalizeSalesReport = (responseData: any): SalesReportData => {
  const report = responseData?.data || responseData || {}
  return {
    summary: report.summary || {},
    orders: Array.isArray(report.orders) ? report.orders : [],
    products: Array.isArray(report.products) ? report.products : [],
  }
}

export default function SalesInventoryReport() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue())
  const [salesReport, setSalesReport] = useState<SalesReportData>({
    orders: [],
    products: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const monthlyOrders = salesReport.orders

  const productSummary = useMemo<ProductSalesSummary[]>(() => {
    if (salesReport.products.length > 0) {
      return salesReport.products
    }

    const summaryMap = new Map<string, ProductSalesSummary>()

    monthlyOrders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const current = summaryMap.get(item.name) || {
          name: item.name,
          quantity: 0,
          revenue: 0,
        }

        current.quantity += Number(item.quantity) || 0
        current.revenue +=
          (Number(item.price) || 0) * (Number(item.quantity) || 0)
        summaryMap.set(item.name, current)
      })
    })

    return Array.from(summaryMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    )
  }, [monthlyOrders, salesReport.products])

  const reportSummary = useMemo(() => {
    if (salesReport.summary && Object.keys(salesReport.summary).length > 0) {
      return {
        revenue: Number(salesReport.summary.total_revenue) || 0,
        itemsSold: Number(salesReport.summary.items_sold) || 0,
        completedOrders: Number(salesReport.summary.completed_orders) || 0,
        averageOrderValue:
          Number(salesReport.summary.average_order_value) || 0,
      }
    }

    const revenue = monthlyOrders.reduce(
      (total, order) => total + (Number(order.total) || 0),
      0
    )
    const itemsSold = productSummary.reduce(
      (total, product) => total + product.quantity,
      0
    )
    const completedOrders = monthlyOrders.filter((order) =>
      order.status?.toLowerCase().includes('selesai')
    ).length

    return {
      revenue,
      itemsSold,
      completedOrders,
      averageOrderValue:
        monthlyOrders.length > 0 ? Math.round(revenue / monthlyOrders.length) : 0,
    }
  }, [monthlyOrders, productSummary, salesReport.summary])

  useEffect(() => {
    loadSalesReport()
  }, [selectedMonth])

  const loadSalesReport = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await salesReportAPI.getSalesReport(selectedMonth)
      setSalesReport(normalizeSalesReport(response.data))
    } catch (err: any) {
      setSalesReport({ orders: [], products: [], summary: {} })
      setError(
        err.response?.data?.message ||
          'Gagal memuat report dari backend. Pastikan endpoint report tersedia.'
      )
    } finally {
      setLoading(false)
    }
  }

  const generateExcelFile = async () => {
    try {
      const response = await salesReportAPI.exportSalesReport(selectedMonth)
      const blob = new Blob([response.data], {
        type:
          response.headers?.['content-type'] ||
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan-penjualan-toko-erina-${selectedMonth}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      return
    } catch {
      setError(
        'Export dari backend belum tersedia. File Excel dibuat dari data report backend yang sedang tampil.'
      )
    }

    const monthLabel = getMonthLabel(selectedMonth)
    const orderRows = monthlyOrders
      .map(
        (order) => `
          <tr>
            <td>${escapeHtml(order.id)}</td>
            <td>${escapeHtml(
              new Date(order.created_at).toLocaleDateString('id-ID')
            )}</td>
            <td>${escapeHtml(order.customer_name)}</td>
            <td>${escapeHtml(order.phone)}</td>
            <td>${escapeHtml(order.status)}</td>
            <td>${Number(order.subtotal || 0)}</td>
            <td>${Number(order.shipping_fee || 0)}</td>
            <td>${Number(order.total || 0)}</td>
          </tr>`
      )
      .join('')
    const productRows = productSummary
      .map(
        (product) => `
          <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>${product.quantity}</td>
            <td>${product.revenue}</td>
          </tr>`
      )
      .join('')

    const workbook = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            table { border-collapse: collapse; width: 100%; margin-bottom: 28px; }
            th, td { border: 1px solid #b8c7d9; padding: 8px; text-align: left; }
            th { background: #e0f2fe; font-weight: 700; }
            h1, h2 { color: #0c4a6e; }
          </style>
        </head>
        <body>
          <h1>Laporan Penjualan Toko Erina - ${escapeHtml(monthLabel)}</h1>
          <h2>Ringkasan Bulanan</h2>
          <table>
            <tr><th>Total Pesanan</th><td>${monthlyOrders.length}</td></tr>
            <tr><th>Pesanan Selesai</th><td>${reportSummary.completedOrders}</td></tr>
            <tr><th>Produk Terjual</th><td>${reportSummary.itemsSold}</td></tr>
            <tr><th>Total Penghasilan</th><td>${reportSummary.revenue}</td></tr>
            <tr><th>Rata-rata Nilai Pesanan</th><td>${reportSummary.averageOrderValue}</td></tr>
          </table>

          <h2>Daftar Pesanan</h2>
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Telepon</th>
                <th>Status</th>
                <th>Subtotal</th>
                <th>Ongkir</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${orderRows}</tbody>
          </table>

          <h2>Inventaris Produk Terjual</h2>
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Jumlah Terjual</th>
                <th>Penghasilan Produk</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>
        </body>
      </html>`

    const blob = new Blob([workbook], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-penjualan-toko-erina-${selectedMonth}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Inventaris Penjualan
          </h1>
          <p className="mt-2 text-gray-600">
            Rekap pesanan, produk terjual, dan penghasilan bulanan Toko Erina.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3">
            <CalendarDays size={18} className="text-sky-700" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="bg-transparent font-semibold text-gray-800 outline-none"
            />
          </label>
          <button
            type="button"
            onClick={generateExcelFile}
            disabled={loading || monthlyOrders.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />
            Generate Excel
          </button>
          <button
            type="button"
            onClick={loadSalesReport}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sky-200 bg-white px-5 py-3 font-semibold text-sky-800 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-xl border-2 border-sky-100 bg-sky-50 p-4 font-semibold text-sky-800">
          <Loader size={20} className="animate-spin" />
          Memuat report penjualan dari backend...
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-sky-800">Total Pesanan</p>
            <ReceiptText size={28} className="text-sky-700 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-sky-950">
            {monthlyOrders.length}
          </p>
          <p className="mt-2 text-xs text-sky-700">
            Periode {getMonthLabel(selectedMonth)}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-800">
              Total Penghasilan
            </p>
            <TrendingUp size={28} className="text-emerald-700 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-emerald-950">
            {formatCurrency(reportSummary.revenue)}
          </p>
          <p className="mt-2 text-xs text-emerald-700">
            Dari seluruh pesanan bulan ini
          </p>
        </div>

        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">
              Produk Terjual
            </p>
            <PackageCheck size={28} className="text-amber-700 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-amber-950">
            {reportSummary.itemsSold}
          </p>
          <p className="mt-2 text-xs text-amber-700">
            Akumulasi semua item pesanan
          </p>
        </div>

        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-indigo-800">
              Rata-rata Pesanan
            </p>
            <FileSpreadsheet size={28} className="text-indigo-700 opacity-30" />
          </div>
          <p className="text-3xl font-bold text-indigo-950">
            {formatCurrency(reportSummary.averageOrderValue)}
          </p>
          <p className="mt-2 text-xs text-indigo-700">
            Nilai rata-rata per transaksi
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Report Penjualan Bulanan
            </h2>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              {monthlyOrders.length} transaksi
            </span>
          </div>

          {monthlyOrders.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="font-semibold text-gray-900">
                Belum ada penjualan pada bulan ini
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Pilih bulan lain atau buat pesanan baru dari halaman toko.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlyOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-sky-50/50">
                      <td className="px-4 py-3 font-semibold text-sky-800">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {formatCurrency(Number(order.total) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Inventaris Produk Terjual
          </h2>

          {productSummary.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="font-semibold text-gray-900">
                Belum ada produk terjual
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Ringkasan item akan muncul otomatis dari pesanan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {productSummary.map((product, index) => (
                <div
                  key={product.name}
                  className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-sky-700">
                        #{index + 1}
                      </p>
                      <h3 className="truncate font-semibold text-gray-900">
                        {product.name}
                      </h3>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-gray-900">
                      {product.quantity} terjual
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
