"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const handleDashboardClick = () => {
    if (user?.is_admin || user?.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/customer")
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Host Domain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/domains" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Domains
            </Link>
            <Link href="/hosting" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Hosting
            </Link>
            <Link href="/support" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Support
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleDashboardClick} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.is_admin ? "Admin Panel" : "Dashboard"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/get-started">
                  <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/domains"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Domains
              </Link>
              <Link
                href="/hosting"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hosting
              </Link>
              <Link
                href="/support"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>

              {user ? (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleDashboardClick()
                      setIsMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.is_admin ? "Admin Panel" : "Dashboard"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="justify-start text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/get-started" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
