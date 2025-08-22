import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Historias Clínicas Digitales - EcommerceVet',
  description: 'Sistema de gestión de historias clínicas digitales para mascotas. Registro médico completo, seguimiento de vacunas, alertas y más.',
  keywords: ['historias clínicas', 'veterinaria', 'mascotas', 'salud animal', 'registros médicos']
}

export default function HistoriasClinicasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  )
}