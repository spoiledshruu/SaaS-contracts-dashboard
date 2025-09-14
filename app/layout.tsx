import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/auth-context"
import { ContractsProvider } from "@/context/contracts-context"
import { AppProvider } from "@/context/app-context"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ContractsPro - SaaS Contracts Management Dashboard",
  description: "Manage and analyze your contract portfolio with AI-powered insights",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AppProvider>
            <AuthProvider>
              <ContractsProvider>{children}</ContractsProvider>
            </AuthProvider>
          </AppProvider>
        </Suspense>
      </body>
    </html>
  )
}
