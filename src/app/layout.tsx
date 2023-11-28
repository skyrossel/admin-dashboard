import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import '@/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/theme-provider'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toaster-provider'

const archivo = Archivo({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'The Admin Dashboard is an essential web application for owners to oversee and generate products for their main website. Manage and Create.',
  authors: {
    name: 'Sky Rossel',
    url: 'https://github.com/skyrossel',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={archivo.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <ToasterProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
