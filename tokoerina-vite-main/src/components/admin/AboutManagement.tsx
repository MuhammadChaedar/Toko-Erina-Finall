import { useState, useEffect } from 'react'
import { aboutAPI } from '../../services/api'
import { AlertCircle, Loader, Save, Upload, X } from 'lucide-react'
import { handleImageUpload } from '../../utils/imageUpload'
import { defaultAboutContent } from '../../data/aboutContent'

interface AboutData {
  id?: string
  title: string
  description: string
  story: string
  vision: string
  mission: string
  commitment: string
  image_url?: string
  image_base64?: string
  whatsapp_number: string
  email: string
  address: string
}

export default function AboutManagement() {
  const [formData, setFormData] = useState<AboutData>({
    ...defaultAboutContent,
    image_base64: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await aboutAPI.getPublicAbout()
      const data = response.data.data || response.data
      setFormData({
        ...defaultAboutContent,
        ...data,
        image_base64: '',
      })
      setImagePreview(data.image_url || null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data tentang')
      // Set default values if API fails
      setFormData({
        ...defaultAboutContent,
        image_base64: '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await handleImageUpload(file)
    if (result.success && result.data) {
      setFormData({ ...formData, image_base64: result.data })
      setImagePreview(result.data)
      setUploadError(null)
    } else {
      setUploadError(result.error || 'Gagal mengupload gambar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const submitData: Record<string, string> = {
        title: formData.title,
        description: formData.description,
        story: formData.story,
        vision: formData.vision,
        mission: formData.mission,
        commitment: formData.commitment,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        address: formData.address,
      }

      if (formData.image_base64) {
        submitData.image_base64 = formData.image_base64
      }

      await aboutAPI.updateAbout(submitData)
      setSuccess('Informasi tentang berhasil diperbarui!')
      await loadAboutData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      const status = err.response?.status
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menyimpan informasi'

      setError(
        status ? `Gagal menyimpan informasi (${status}): ${message}` : message,
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Memuat data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Manajemen Halaman Tentang</h1>
        <p className="text-gray-600 mt-2">Edit informasi tentang Toko Erina</p>
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

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">✓ {success}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6"
      >
        <div>
          <label className="block text-sm text-gray-700 mb-2">Judul</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
            placeholder="Tentang Toko Erina"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Deskripsi Singkat
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
            rows={4}
            placeholder="Deskripsi singkat yang tampil di awal section Tentang..."
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Isi Utama Halaman Tentang
          </label>
          <textarea
            value={formData.story}
            onChange={(e) =>
              setFormData({ ...formData, story: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
            rows={5}
            placeholder="Cerita utama tentang Toko Erina yang tampil di samping gambar..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Visi</label>
            <textarea
              value={formData.vision}
              onChange={(e) =>
                setFormData({ ...formData, vision: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
              rows={4}
              placeholder="Visi Toko Erina..."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Misi</label>
            <textarea
              value={formData.mission}
              onChange={(e) =>
                setFormData({ ...formData, mission: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
              rows={4}
              placeholder="Misi Toko Erina..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Komitmen</label>
          <textarea
            value={formData.commitment}
            onChange={(e) =>
              setFormData({ ...formData, commitment: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
            rows={4}
            placeholder="Komitmen pelayanan Toko Erina..."
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Gambar Halaman Tentang (Opsional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
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
                  className="max-w-2xl w-full h-auto mx-auto object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'
                  }}
                />
                {formData.image_base64 && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({ ...formData, image_base64: '' })
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-xl text-gray-900 font-semibold mb-4">
            Informasi Kontak
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                placeholder="628123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                placeholder="info@tokoerina.com"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-gray-700 mb-2">Alamat</label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
              rows={3}
              placeholder="Jl. Contoh No. 123, Jakarta Selatan"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-sky-800 text-white py-3 rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
          >
            <Save size={20} />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}



