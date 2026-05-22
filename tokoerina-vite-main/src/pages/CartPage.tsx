import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import type { CartItem } from '../App'

type CartPageProps = {
  cart: CartItem[]
  cartItemCount: number
  updateCartQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
}

export default function CartPage({
  cart,
  cartItemCount,
  updateCartQuantity,
  removeFromCart,
}: CartPageProps) {
  const cartTotal = cart.reduce(
    (total, item) => total + (Number(item.product.price) || 0) * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={cartItemCount} />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Keranjang Belanja
            </h1>
            <p className="mt-2 text-gray-600">
              Cek kembali produk pilihan sebelum melanjutkan pesanan.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <ShoppingCart size={30} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Keranjang masih kosong
              </h2>
              <p className="mt-2 text-gray-600">
                Tambahkan produk dari halaman produk Toko Erina.
              </p>
              <Link
                to="/#produk"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
              >
                Lihat Produk
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Produk Dipilih
                  </h2>
                  <p className="text-sm text-gray-600">
                    {cartItemCount} produk dalam keranjang
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-4 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-sky-600 font-medium">
                            Rp {item.product.price?.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            title="Kurangi jumlah"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            title="Tambah jumlah"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="w-32 text-right font-bold text-gray-900">
                          Rp{' '}
                          {(
                            (Number(item.product.price) || 0) * item.quantity
                          ).toLocaleString('id-ID')}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center"
                          title="Hapus produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900">
                  Ringkasan Pesanan
                </h2>
                <div className="mt-5 space-y-3 border-b border-gray-100 pb-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Total produk</span>
                    <span>{cartItemCount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-sky-600">
                    Rp {cartTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <Link
                  to="/#produk"
                  className="mt-6 flex w-full items-center justify-center rounded-xl border border-sky-600 px-5 py-3 font-semibold text-sky-600 transition-colors hover:bg-sky-50"
                >
                  Tambah Produk Lain
                </Link>
                <Link
                  to="/pembayaran"
                  className="mt-3 flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
                >
                  Lanjut Pembayaran
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}




