import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import React from 'react'

interface IProps {
  children: React.ReactNode
}

export default function layout({ children }: IProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
