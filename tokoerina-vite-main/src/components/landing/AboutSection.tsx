import { useEffect, useState } from 'react'
import { Award, Heart, PackageCheck, ShoppingBasket, Target } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { aboutAPI } from '../../services/api'
import { defaultAboutContent } from '../../data/aboutContent'

export default function AboutSection() {
  const [aboutContent, setAboutContent] = useState(defaultAboutContent)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await aboutAPI.getPublicAbout()
        setAboutContent({
          ...defaultAboutContent,
          ...(response.data.data || response.data || {}),
        })
      } catch {
        setAboutContent(defaultAboutContent)
      }
    })()
  }, [])

  const features = [
    {
      icon: Target,
      title: 'Visi Kami',
      description: aboutContent.vision,
      color: 'from-sky-700 to-cyan-600',
      bgColor: 'bg-sky-50',
    },
    {
      icon: Award,
      title: 'Misi Kami',
      description: aboutContent.mission,
      color: 'from-emerald-600 to-teal-500',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Heart,
      title: 'Komitmen Kami',
      description: aboutContent.commitment,
      color: 'from-sky-500 to-sky-500',
      bgColor: 'bg-sky-50',
    },
  ]

  const highlights = [
    {
      title: 'Sembako Lengkap',
      description: 'Beras, minyak, gula, tepung, telur, mie instan, dan kebutuhan dapur lainnya.',
    },
    {
      title: 'Belanja Praktis',
      description: 'Pilih produk dari rumah dan hubungi toko untuk konfirmasi pesanan.',
    },
    {
      title: 'Harga Bersahabat',
      description: 'Pilihan produk harian dengan harga yang cocok untuk kebutuhan keluarga.',
    },
  ]

  return (
    <section id="tentang" className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
            Tentang Kami
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-950 md:text-5xl">
            {aboutContent.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            {aboutContent.description}
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <ShoppingBasket className="text-sky-800" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-sky-800">
                  Toko Sembako Online
                </p>
                <h3 className="text-2xl font-bold text-slate-950">
                  Belanja kebutuhan pokok tanpa ribet
                </h3>
              </div>
            </div>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              {aboutContent.story || aboutContent.description}
            </p>

            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <PackageCheck className="text-emerald-700" size={14} />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-slate-950">
                      {highlight.title}
                    </div>
                    <p className="text-sm text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
              <ImageWithFallback
                src={aboutContent.image_url || '/toko-erina-logo.svg'}
                alt="Logo Toko Erina"
                className="h-96 w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
              >
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-950 md:text-2xl">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




