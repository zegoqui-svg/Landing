import type { Metadata } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SILUEL Centro de Terapia y Masaje | Guadalajara | Maderoterapia y Tratamientos Corporales',
  description: 'Centro especializado en maderoterapia, tratamientos reductivos, masajes terapéuticos, faciales personalizados y recuperación post-operatoria en Guadalajara. Reserva tu cita en Plan de Ayala 1859.',
  keywords: 'maderoterapia, masajes, tratamientos corporales, drenaje linfático, post-operatorio, faciales, belleza, bienestar, Guadalajara, spa, reductores, levantamiento de glúteos, técnicas colombianas, massage therapy, cosmetic massage',
  authors: [{ name: 'Elsa Gómez - SILUEL' }],
  creator: 'SILUEL Centro de Terapia y Masaje',
  publisher: 'SILUEL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://spa-landing-vert.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://spa-landing-vert.vercel.app',
    siteName: 'SILUEL Centro de Terapia y Masaje',
    title: 'SILUEL Centro de Terapia y Masaje | Guadalajara | Maderoterapia y Tratamientos Corporales',
    description: 'Centro especializado en maderoterapia, tratamientos reductivos, masajes terapéuticos, faciales personalizados y recuperación post-operatoria en Guadalajara.',
    images: [
      {
        url: 'https://spa-landing-vert.vercel.app/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'SILUEL Centro de Terapia y Masaje - Guadalajara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SILUEL Centro de Terapia y Masaje | Guadalajara',
    description: 'Centro especializado en maderoterapia, tratamientos reductivos y masajes terapéuticos en Guadalajara.',
    images: ['https://spa-landing-vert.vercel.app/images/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "SILUEL Centro de Terapia y Masaje",
              "description": "Centro especializado en maderoterapia, tratamientos reductivos, masajes terapéuticos, faciales personalizados y recuperación post-operatoria.",
              "url": "https://spa-landing-vert.vercel.app",
              "telephone": "+523339657478",
              "email": "gomezelsa806@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plan de Ayala 1859, INT 28",
                "addressLocality": "Guadalajara",
                "addressRegion": "Jalisco",
                "postalCode": "45130",
                "addressCountry": "MX"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "20.6597",
                "longitude": "-103.3496"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "20:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ],
              "priceRange": "$$",
              "image": "https://spa-landing-vert.vercel.app/images/hero.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=100091949245186",
                "https://www.instagram.com/siluel_guadalajara"
              ],
              "areaServed": {
                "@type": "City",
                "name": "Guadalajara"
              },
              "serviceType": [
                "Maderoterapia",
                "Tratamientos Reductivos",
                "Masajes Terapéuticos",
                "Faciales Personalizados",
                "Drenaje Linfático",
                "Recuperación Post-Operatoria",
                "Técnicas Colombianas",
                "Levantamiento de Glúteos"
              ]
            })
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased text-brand-dark bg-brand-light`}>
        {children}
      </body>
    </html>
  )
}
