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
  title: 'SILUEL Centro de Terapia y Masaje | Guadalajara',
  description: 'Centro especializado en maderoterapia, tratamientos reductivos, masajes terapéuticos, faciales personalizados y recuperación post-operatoria. Plan de Ayala 1859.',
  keywords: 'maderoterapia, masajes, tratamientos corporales, drenaje linfático, post-operatorio, faciales, belleza, bienestar, Guadalajara, Plan de Ayala',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased text-brand-dark bg-brand-light`}>
        {children}
      </body>
    </html>
  )
}