import {
  Mail,
  Phone,
  MapPin,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { aboutAPI, contactMessagesAPI } from '../../services/api'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone_number: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState({
    whatsapp: '628123456789',
    email: 'info@tokoerina.com',
    address: 'Jl. Contoh No. 123, Jakarta Selatan',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await aboutAPI.getPublicAbout()
        const about = res.data.data || res.data || {}

        setContactInfo({
          whatsapp: about.whatsapp_number || '628123456789',
          email: about.email || 'info@tokoerina.com',
          address: about.address || 'Jl. Contoh No. 123, Jakarta Selatan',
        })
      } catch {
        setContactInfo({
          whatsapp: '628123456789',
          email: 'info@tokoerina.com',
          address: 'Jl. Contoh No. 123, Jakarta Selatan',
        })
      }
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await contactMessagesAPI.submitContactForm(form)
      setSubmitted(true)
      setForm({ name: '', phone_number: '', message: '' })
      // Auto-reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Gagal mengirim pesan. Silakan coba lagi.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="kontak"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-sky-100 text-sky-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Kontak
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Punya pertanyaan? Kami siap membantu Anda!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                {/* WhatsApp */}
                <div className="flex items-start space-x-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">WhatsApp</div>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors"
                    >
                      +{contactInfo.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-sky-100 to-sky-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-sky-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Alamat</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {contactInfo.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-50 rounded-3xl p-8 border border-sky-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Jam Operasional
              </h4>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Senin - Jumat</span>
                  <span>07:00 - 22:00 WIB</span>
                </div>
                <div className="border-t border-sky-200"></div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sabtu</span>
                  <span>07:00 - 23:00 WIB</span>
                </div>
                <div className="border-t border-sky-200"></div>
                <div className="flex justify-between">
                  <span className="font-semibold">Minggu</span>
                  <span>08:00 - 22:00 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h3>

            {/* Success Message */}
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <div className="font-semibold text-green-900">
                    Pesan Terkirim!
                  </div>
                  <p className="text-sm text-green-800">
                    Terima kasih! Kami akan segera membalas pesan Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <div className="font-semibold text-red-900">
                    Gagal Mengirim
                  </div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-700 transition-all"
                  placeholder="Masukkan nama Anda"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp *
                </label>
                <input
                  type="phone_number"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-700 transition-all"
                  placeholder="6281*******"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pesan *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-700 transition-all resize-none"
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-500 to-sky-500 text-white py-4 rounded-xl hover:from-sky-600 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Send size={20} />
                <span>{loading ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}




