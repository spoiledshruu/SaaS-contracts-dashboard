"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (isAuthenticated) {
        router.push("/dashboard")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const handleDemoMode = () => {
    login("demo-jwt-token", "Demo User")
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ContractsPro</CardTitle>
          <CardDescription>SaaS Contracts Management Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.push("/login")} className="w-full" size="lg">
            Sign In
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button onClick={handleDemoMode} variant="outline" className="w-full bg-transparent" size="lg">
            Continue as Demo User
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo mode provides full access to explore all features
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
