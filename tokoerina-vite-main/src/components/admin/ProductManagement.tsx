import { useState, useEffect } from 'react'
import { productsAPI } from '../../services/api'
import { groceryCategories } from '../../data/groceryProducts'
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader,
  Upload,
  X,
} from 'lucide-react'
import { validateImageFile } from '../../utils/imageUpload'

const productCategories = groceryCategories.filter(
  (category) => category !== 'Semua'
)

interface Product {
  id: string
  name: string
  flavor: string
  description: string
  price: string | number
  image_url: string
  stock_status: string
  is_featured?: boolean
}

interface FormData {
  name: string
  flavor: string
  description: string
  price: string
  image?: File
  stock_status: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    flavor: '',
    description: '',
    price: '',
    stock_status: 'available',
  })

  const normalizePrice = (value: string | number | null | undefined) =>
    String(value ?? '').replace(/[^\d]/g, '')

  const formatPrice = (value: string | number | null | undefined) => {
    const normalizedPrice = normalizePrice(value)
    const priceNumber = Number(normalizedPrice)

    if (!normalizedPrice || Number.isNaN(priceNumber)) {
      return 'Rp 0'
    }

    return `Rp ${priceNumber.toLocaleString('id-ID')}`
  }

  const getErrorMessage = (err: any, fallback: string) => {
    const status = err.response?.status
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      fallback

    return status ? `${fallback} (${status}): ${message}` : message
  }

  // Fetch products
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await productsAPI.getProducts()
      setProducts(response.data.data || response.data)
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal memuat produk'))
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setImagePreview(null)
    setUploadError(null)
    setFormData({
      name: '',
      flavor: '',
      description: '',
      price: '',
      stock_status: 'available',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setImagePreview(product.image_url)
    setUploadError(null)
    setFormData({
      name: product.name,
      flavor: product.flavor,
      description: product.description,
      price: normalizePrice(product.price),
      stock_status: product.stock_status,
    })
    setIsModalOpen(true)
  }

  const handleImageUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setUploadError(validation.error)
      return
    }

    // Store file object directly and create preview
    setFormData({ ...formData, image: file })
    
    // Create preview URL for the file
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setUploadError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi bahwa gambar harus ada (untuk create) atau minimal untuk update
    if (!formData.image && !editingProduct) {
      setUploadError('Gambar harus diupload')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Jika tidak ada gambar baru, hapus field image untuk update
      const submitData =
        editingProduct && !formData.image
          ? (() => {
              const { image, ...rest } = formData
              return { ...rest, price: normalizePrice(rest.price) }
            })()
          : { ...formData, price: normalizePrice(formData.price) }

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, submitData)
      } else {
        await productsAPI.createProduct(submitData)
      }
      await loadProducts()
      setIsModalOpen(false)
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal menyimpan produk'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      setError(null)
      await productsAPI.deleteProduct(id)
      await loadProducts()
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal menghapus produk'))
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      setError(null)
      await productsAPI.toggleFeatured(id)
      await loadProducts()
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal mengubah status unggulan'))
    }
  }

  const handleStockStatusChange = async (id: string, status: string) => {
    try {
      setError(null)
      await productsAPI.updateStockStatus(id, status)
      await loadProducts()
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal mengubah stock status'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Memuat produk...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600 mt-2">
            Kelola produk sembako Toko Erina
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-sky-800 text-white px-4 py-2 rounded-lg hover:bg-sky-900 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-red-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">Belum ada produk</p>
          <button
            onClick={openAddModal}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            Tambah produk pertama →
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => {
            // Get stock status styling
            const getStockStatusStyle = (status: string) => {
              const statusMap: {
                [key: string]: {
                  label: string
                  bgColor: string
                  textColor: string
                  badgeBgColor: string
                }
              } = {
                available: {
                  label: '✓ Tersedia',
                  bgColor: 'bg-green-50',
                  textColor: 'text-green-700',
                  badgeBgColor: 'bg-green-100',
                },
                limited: {
                  label: '⚠ Terbatas',
                  bgColor: 'bg-yellow-50',
                  textColor: 'text-yellow-700',
                  badgeBgColor: 'bg-yellow-100',
                },
                out_of_stock: {
                  label: '✗ Habis',
                  bgColor: 'bg-red-50',
                  textColor: 'text-red-700',
                  badgeBgColor: 'bg-red-100',
                },
              }
              return statusMap[status] || statusMap.available
            }

            const stockStatus = getStockStatusStyle(product.stock_status)
            const formattedPrice = formatPrice(product.price)

            return (
              <div
                key={product.id}
                className={`relative rounded-2xl p-6 shadow-lg border-2 transition-all ${stockStatus.bgColor} ${
                  product.stock_status === 'out_of_stock'
                    ? 'border-red-200 opacity-60'
                    : 'border-gray-200 bg-white hover:shadow-xl'
                }`}
              >
                {/* Unggulan Indicator Badge */}
                {product.is_featured && (
                  <div className="absolute -top-3 -left-3 bg-gradient-to-r from-sky-400 to-sky-700 text-white rounded-full p-3 shadow-lg animate-pulse">
                    <div className="text-2xl">⭐</div>
                  </div>
                )}
                <div className="flex gap-6">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-xl"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl text-gray-900 font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {product.flavor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-600">
                          {formattedPrice}
                        </p>
                        <div
                          className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${stockStatus.badgeBgColor} ${stockStatus.textColor} text-center`}
                        >
                          {stockStatus.label}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <select
                        value={product.stock_status}
                        onChange={(e) =>
                          handleStockStatusChange(product.id, e.target.value)
                        }
                        className={`px-3 py-1 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 font-medium ${stockStatus.badgeBgColor} ${stockStatus.textColor}`}
                      >
                        <option value="available">✓ Tersedia</option>
                        <option value="limited">⚠ Terbatas</option>
                        <option value="out_of_stock">✗ Habis</option>
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`px-4 py-1 text-sm rounded-lg transition-all font-semibold flex items-center gap-2 ${
                            product.is_featured
                              ? 'bg-yellow-400 text-white hover:bg-yellow-500 shadow-md'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <span className="text-lg">⭐</span>
                          {product.is_featured
                            ? 'Hapus Unggulan'
                            : 'Jadikan Unggulan'}
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 font-medium"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 font-medium"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Modal Content */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-900 p-2 rounded-full transition-all duration-200 z-10"
              title="Close (ESC)"
            >
              <X size={24} />
            </button>

            {/* Modal Container */}
            <div
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-900 mb-6">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama Produk"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Harga (Rp)"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: normalizePrice(e.target.value),
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                  <select
                    value={formData.flavor}
                    onChange={(e) =>
                      setFormData({ ...formData, flavor: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {productCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Deskripsi Produk"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  rows={3}
                  required
                />

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-gray-700 font-semibold mb-2">
                      {editingProduct
                        ? 'Ubah Gambar Produk'
                        : 'Upload Gambar Produk'}{' '}
                      *
                    </span>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Klik untuk upload gambar
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WebP, GIF (max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUploadChange}
                        />
                      </label>
                    </div>
                  </label>

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-red-800">{uploadError}</p>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      {!editingProduct || formData.image ? (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setFormData({ ...formData, image: undefined })
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>

                <select
                  value={formData.stock_status}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-sky-800 text-white py-2 rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}



