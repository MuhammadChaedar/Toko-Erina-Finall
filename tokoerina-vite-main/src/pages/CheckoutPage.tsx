import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ClipboardCheck, Home, MapPin, PackageCheck, Truck } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import type { CartItem } from '../App'
import { ordersAPI } from '../services/api'

type CheckoutPageProps = {
  cart: CartItem[]
  cartItemCount: number
  clearCart: () => void
}

export default function CheckoutPage({
  cart,
  cartItemCount,
  clearCart,
}: CheckoutPageProps) {
  const navigate = useNavigate()
  const [orderCode, setOrderCode] = useState('')
  const [submittedTotal, setSubmittedTotal] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  })

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + (Number(item.product.price) || 0) * item.quantity,
        0
      ),
    [cart]
  )
  const shippingFee = cart.length > 0 ? 10000 : 0
  const grandTotal = cartTotal + shippingFee

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    const transactionCode = `MLJ-${Date.now().toString().slice(-8)}`
    const newOrder = {
      id: transactionCode,
      customer_name: formData.name,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price) || 0,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      shipping_fee: shippingFee,
      total: grandTotal,
      status: 'Menunggu Diproses',
      created_at: new Date().toISOString(),
    }

    try {
      const response = await ordersAPI.createOrder({
        customer_name: newOrder.customer_name,
        phone: newOrder.phone,
        address: newOrder.address,
        note: newOrder.note,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        shipping_fee: newOrder.shipping_fee,
        total: newOrder.total,
      })
      const savedOrder = response.data?.data || response.data || {}
      newOrder.id =
        savedOrder.order_code || savedOrder.id || savedOrder.code || transactionCode
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message ||
          'Gagal membuat transaksi. Pastikan backend aktif lalu coba lagi.'
      )
      return
    }

    setSubmittedTotal(grandTotal)
    setOrderCode(newOrder.id)
    clearCart()
  }

  if (orderCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartItemCount={0} />
        <main className="pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-8 py-8 text-center text-white">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-green-600 shadow-lg">
                  <CheckCircle2 size={44} />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
                  Konfirmasi Pesanan
                </p>
                <h1 className="mt-3 text-4xl font-bold">
                  Pesanan Berhasil Dibuat
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sky-50">
                  Terima kasih, {formData.name || 'pelanggan'}! Pesanan kamu
                  sudah masuk dan akan segera diproses oleh Admin Toko Erina.
                </p>
              </div>

              <div className="p-8">
                <div className="rounded-2xl bg-sky-50 p-5 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Nomor Transaksi
                  </p>
                  <p className="mt-2 text-3xl font-bold text-sky-600">
                    {orderCode}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Simpan nomor ini untuk konfirmasi pesanan.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 p-4">
                    <ClipboardCheck className="mb-3 text-green-600" size={26} />
                    <p className="font-semibold text-gray-900">
                      Pesanan Masuk
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Data pesanan sudah tercatat.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <PackageCheck className="mb-3 text-sky-600" size={26} />
                    <p className="font-semibold text-gray-900">
                      Segera Diproses
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Admin akan menyiapkan pesanan.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <Truck className="mb-3 text-blue-600" size={26} />
                    <p className="font-semibold text-gray-900">
                      Total Pesanan
                    </p>
                    <p className="mt-1 text-sm font-semibold text-sky-600">
                      Rp {submittedTotal.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-center text-green-800">
                  Pesanan berhasil dibuat. Silakan tunggu konfirmasi dari admin
                  Toko Erina.
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
                >
                  <Home size={20} />
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={cartItemCount} />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Transaksi Pesanan
            </h1>
            <p className="mt-2 text-gray-600">
              Lengkapi data pengiriman sebelum membuat pesanan.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">
                Belum ada produk untuk dibayar
              </h2>
              <p className="mt-2 text-gray-600">
                Masukkan produk ke keranjang terlebih dahulu.
              </p>
              <Link
                to="/#produk"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
              >
                Pilih Produk
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-6 lg:grid-cols-[1fr_380px]"
            >
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800 lg:col-span-2">
                  {submitError}
                </div>
              )}
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center gap-3">
                  <MapPin className="text-sky-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Data Pembeli
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">
                      Nama Lengkap
                    </span>
                    <input
                      required
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                      placeholder="Nama penerima"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">
                      Nomor WhatsApp
                    </span>
                    <input
                      required
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          phone: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                      placeholder="08xxxxxxxxxx"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-gray-700">
                    Alamat Pengiriman
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={formData.address}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        address: event.target.value,
                      })
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                    placeholder="Tulis alamat lengkap"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-gray-700">
                    Catatan Pesanan
                  </span>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(event) =>
                      setFormData({ ...formData, note: event.target.value })
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                    placeholder="Opsional"
                  />
                </label>
              </section>

              <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center gap-3">
                  <Truck className="text-sky-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Ringkasan Pesanan
                  </h2>
                </div>

                <div className="space-y-4 border-b border-gray-100 pb-5">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x Rp{' '}
                          {item.product.price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        Rp{' '}
                        {(
                          (Number(item.product.price) || 0) * item.quantity
                        ).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-b border-gray-100 pb-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkir</span>
                    <span>Rp {shippingFee.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-sky-600">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
                >
                  Buat Transaksi
                </button>
              </aside>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}




