"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const adminCredentials = [
    {
      email: "admin@hostdomainreseller.com",
      password: "Admin123!",
      role: "Super Admin",
      description: "Full system access",
    },
    {
      email: "manager@hostdomainreseller.com",
      password: "Manager123!",
      role: "Manager",
      description: "Client management access",
    },
    {
      email: "support@hostdomainreseller.com",
      password: "Support123!",
      role: "Support Admin",
      description: "Support and billing access",
    },
  ]

  const testCredentials = [
    {
      email: "john.doe@example.com",
      password: "Customer123!",
      role: "Customer",
      description: "Regular customer account",
    },
    {
      email: "jane.smith@example.com",
      password: "Customer123!",
      role: "Customer",
      description: "Premium customer account",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      let data
      try {
        data = await response.json()
      } catch {
        // If JSON parsing fails, try to get text response
        const text = await response.text()
        throw new Error(text || "Invalid response from server")
      }

      if (response.ok) {
        // Store token and user info
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect based on user role
        if (data.user.is_admin) {
          router.push("/admin")
        } else {
          router.push("/customer")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (credentials: { email: string; password: string }) => {
    setEmail(credentials.email)
    setPassword(credentials.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Login Form */}
        <div className="lg:col-span-1">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {"Don't have an account? "}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Credentials */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Admin Login Credentials
              </CardTitle>
              <CardDescription>Use these credentials to access admin features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminCredentials.map((cred, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">{cred.role}</Badge>
                    <Button size="sm" variant="outline" onClick={() => quickLogin(cred)}>
                      Quick Login
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> {cred.email}
                    </p>
                    <p>
                      <strong>Password:</strong> {cred.password}
                    </p>
                    <p className="text-gray-600">{cred.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Test Customer Credentials */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Test Customer Accounts
              </CardTitle>
              <CardDescription>Sample customer accounts for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCredentials.map((cred, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{cred.role}</Badge>
                    <Button size="sm" variant="outline" onClick={() => quickLogin(cred)}>
                      Quick Login
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> {cred.email}
                    </p>
                    <p>
                      <strong>Password:</strong> {cred.password}
                    </p>
                    <p className="text-gray-600">{cred.description}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Demo Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Domain search and registration</li>
                  <li>• Hosting plan selection</li>
                  <li>• Order processing</li>
                  <li>• Payment simulation</li>
                  <li>• Invoice generation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
