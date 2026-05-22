import { useMemo, useState, useEffect } from 'react'
import { productsAPI } from '../../services/api'
import { CreditCard, Loader, Search, ShoppingCart, X } from 'lucide-react'
import { groceryCategories } from '../../data/groceryProducts'

type ProductSectionProps = {
  addToCart: (product: any) => void
  buyNow: (product: any) => void
}

export default function ProductSection({
  addToCart,
  buyNow,
}: ProductSectionProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await productsAPI.getPublicProducts({ limit: 12 })
        setProducts(res.data.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getStockStatus = (status: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; bgColor: string }
    } = {
      available: {
        label: 'Tersedia',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
      },
      limited: {
        label: 'Terbatas',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
      },
      out_of_stock: {
        label: 'Habis',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
      },
    }
    return statusMap[status] || statusMap.available
  }

  const categoryFor = (product: any) => product.category || product.flavor || 'Lainnya'

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const productCategory = categoryFor(product)
      const matchesCategory =
        activeCategory === 'Semua' || productCategory === activeCategory
      const matchesSearch =
        !query ||
        [product.name, productCategory, product.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, products, searchQuery])

  return (
    <section
      id="produk"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Produk Kami</h2>
          <p className="text-gray-600">
            Kebutuhan sembako dan perlengkapan harian pilihan Toko Erina
          </p>
        </div>

        <div className="mb-8 space-y-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk sembako..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {groceryCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === category
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-sky-800 mr-2" size={32} />
            <span className="text-gray-600">Memuat produk...</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((p) => {
              const stock = getStockStatus(p.stock_status)
              const productCategory = categoryFor(p)
              return (
                <div
                  key={p.id}
                  className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => setSelectedProduct(p)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-56 bg-gray-200 group">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Stock Badge */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${stock.bgColor} ${stock.color} border border-current border-opacity-30`}
                    >
                      {stock.label}
                    </div>
                    {/* Unggulan Badge */}
                    {p.is_featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-sky-800 text-white">
                        ⭐ Unggulan
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <svg
                          className="w-6 h-6 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Title and Flavor */}
                    <div className="min-h-[86px]">
                      <h3 className="mb-1 line-clamp-2 text-lg font-bold leading-snug text-gray-900">
                        {p.name}
                      </h3>
                      <p className="text-sm text-sky-600 font-semibold">
                        {productCategory}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="min-h-[44px] text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Price */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <p className="text-2xl font-bold text-sky-600">
                        Rp {p.price?.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Product Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(p)
                        }}
                        disabled={p.stock_status === 'out_of_stock'}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-600 bg-white px-3 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={17} />
                        <span>
                          {p.stock_status === 'out_of_stock'
                            ? 'Stok Habis'
                            : 'Keranjang'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          buyNow(p)
                        }}
                        disabled={p.stock_status === 'out_of_stock'}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <CreditCard size={17} />
                        <span>
                          {p.stock_status === 'out_of_stock'
                            ? 'Stok Habis'
                            : 'Beli Sekarang'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              Produk tidak ditemukan
            </h3>
            <p className="mt-2 text-gray-600">
              Coba gunakan kata kunci lain atau pilih kategori Semua.
            </p>
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[90]"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Main Modal Container */}
            <div
              className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="relative h-80 bg-gray-200 overflow-hidden">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Stock Badge in Modal */}
                <div
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
                    getStockStatus(selectedProduct.stock_status).bgColor
                  } ${getStockStatus(selectedProduct.stock_status).color}`}
                >
                  {getStockStatus(selectedProduct.stock_status).label}
                </div>
                {selectedProduct.is_featured && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold bg-sky-800 text-white">
                    ⭐ Unggulan
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xl text-sky-600 font-semibold mb-4">
                    {categoryFor(selectedProduct)}
                  </p>
                  <p className="text-3xl font-bold text-sky-600">
                    Rp {selectedProduct.price?.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Product Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pesan Sekarang
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                      disabled={
                        selectedProduct.stock_status === 'out_of_stock'
                      }
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-600 bg-white px-4 py-3 font-semibold text-sky-700 transition-colors hover:bg-sky-50 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={20} />
                      <span>
                        {selectedProduct.stock_status === 'out_of_stock'
                          ? 'Stok Habis'
                          : 'Tambah ke Keranjang'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        buyNow(selectedProduct)
                        setSelectedProduct(null)
                      }}
                      disabled={
                        selectedProduct.stock_status === 'out_of_stock'
                      }
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={20} />
                      <span>
                        {selectedProduct.stock_status === 'out_of_stock'
                          ? 'Stok Habis'
                          : 'Beli Sekarang'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}




