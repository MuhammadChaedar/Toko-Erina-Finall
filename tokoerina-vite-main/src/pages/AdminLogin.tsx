import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-sky-50 lg:block"></div>
      <div className="absolute left-10 top-10 hidden h-28 w-28 rounded-full border border-sky-100 bg-sky-50 lg:block"></div>
      <div className="absolute bottom-12 right-16 hidden h-36 w-36 rounded-full border border-sky-100 bg-white lg:block"></div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-sky-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <img
              src="/toko-erina-logo.svg"
              alt="Logo Toko Erina"
              className="mb-8 h-28 w-28 rounded-2xl bg-white object-contain p-2"
            />
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
              Admin Toko Erina
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Kelola toko sembako dengan lebih rapi.
            </h1>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck size={20} />
              </div>
              <p className="font-semibold">Dashboard Toko</p>
            </div>
            <p className="text-sm leading-relaxed text-sky-100">
              Masuk untuk mengatur produk, halaman tentang, dan pesan pelanggan.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50">
              <img
                src="/toko-erina-logo.svg"
                alt="Logo Toko Erina"
                className="h-16 w-16 object-contain"
              />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-slate-950">
              Admin Login
            </h1>
            <p className="text-gray-600">Masuk ke dashboard Toko Erina</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle
                size={20}
                className="mt-0.5 flex-shrink-0 text-red-600"
              />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                placeholder="admin@tokoerina.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-700"
                placeholder="********"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-800 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogIn size={18} />
              {isLoading ? 'Sedang Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm font-medium text-sky-800 hover:text-sky-900">
              {'<- Kembali ke Beranda'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}




