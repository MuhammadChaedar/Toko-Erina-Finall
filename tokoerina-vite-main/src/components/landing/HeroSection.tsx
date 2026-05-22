import {
  ArrowRight,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function HeroSection() {
  const scrollToProducts = () => {
    const element = document.querySelector('#produk')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToAbout = () => {
    const element = document.querySelector('#tentang')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="beranda"
      className="relative flex min-h-screen items-center overflow-hidden bg-white pt-24"
    >
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-sky-50 lg:block"></div>

      <div className="relative container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
              <ShoppingBag size={16} className="mr-2" />
              Belanja Online Mudah
            </span>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight text-slate-950 md:text-6xl lg:text-7xl">
                Toko Sembako
                <span className="block text-sky-800">Toko Erina</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                Belanja kebutuhan harian jadi lebih mudah, hemat, dan praktis.
                Toko Erina menyediakan sembako, bahan dapur, minuman, dan
                perlengkapan rumah tangga dengan pelayanan ramah.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center rounded-full bg-sky-800 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-sky-900 hover:shadow-xl"
              >
                Belanja Sekarang
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button
                onClick={scrollToAbout}
                className="inline-flex items-center justify-center rounded-full border-2 border-sky-800 px-8 py-4 font-semibold text-sky-800 transition-colors hover:bg-sky-50"
              >
                Tentang Toko
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8 sm:gap-8">
              <div>
                <div className="text-2xl font-bold text-sky-800 sm:text-3xl">
                  Lengkap
                </div>
                <div className="text-sm text-gray-600">Kebutuhan Harian</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sky-800 sm:text-3xl">
                  Hemat
                </div>
                <div className="text-sm text-gray-600">Harga Bersahabat</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sky-800 sm:text-3xl">
                  Cepat
                </div>
                <div className="text-sm text-gray-600">Pesanan Diproses</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
            <div className="relative z-10">
              <div className="absolute inset-0 rounded-3xl bg-sky-800 shadow-xl transform rotate-3"></div>
              <div className="relative rounded-3xl bg-white p-8 shadow-2xl transition-transform duration-300 transform -rotate-2 hover:rotate-0">
                <ImageWithFallback
                  src="/toko-erina-logo.svg"
                  alt="Logo Toko Erina"
                  className="h-96 w-full rounded-2xl bg-white object-contain"
                />
              </div>
            </div>

            <div
              className="absolute -left-4 top-8 z-20 rounded-2xl bg-white p-4 shadow-xl animate-bounce"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Truck className="text-emerald-700" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Layanan</div>
                  <div className="font-semibold text-sky-800">Pesan Online</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 bottom-16 z-20 rounded-2xl bg-white p-4 shadow-xl animate-bounce"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                  <Star className="text-sky-800" size={24} fill="currentColor" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-semibold text-sky-800">4.9/5.0</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-8 z-20 hidden rounded-2xl bg-white p-4 shadow-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
                  <ShieldCheck className="text-sky-800" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Produk</div>
                  <div className="font-semibold text-sky-800">Terpercaya</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 right-8 z-20 hidden rounded-2xl bg-white p-4 shadow-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
                  <PackageCheck className="text-sky-800" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Stok</div>
                  <div className="font-semibold text-sky-800">Siap Belanja</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




