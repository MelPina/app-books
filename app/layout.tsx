import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Sistema de Gestión de Libros",
  description: "Aplicación para gestionar una colección de libros",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  )
}

