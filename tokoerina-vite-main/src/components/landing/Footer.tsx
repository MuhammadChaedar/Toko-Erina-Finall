import { Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl mb-4 text-sky-400">Toko Erina</h3>
            <p className="text-gray-400 mb-4">
              sembako berkualitas dengan berbagai pilihan rasa. Dibuat
              dengan cinta dan bahan pilihan.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} Toko Erina. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Navigasi Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#beranda"
                  className="hover:text-sky-400 transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#tentang"
                  className="hover:text-sky-400 transition-colors"
                >
                  Tentang
                </a>
              </li>
              <li>
                <a
                  href="#produk"
                  className="hover:text-sky-400 transition-colors"
                >
                  Produk
                </a>
              </li>
              <li>
                <a
                  href="#kontak"
                  className="hover:text-sky-400 transition-colors"
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Certifications */}
          <div>
            <h4 className="mb-4">Sertifikasi</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Sertifikat BPOM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Sertifikat Halal MUI</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Standar Kebersihan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>by Toko Erina Team</span>
          </p>
        </div>
      </div>
    </footer>
  )
}




