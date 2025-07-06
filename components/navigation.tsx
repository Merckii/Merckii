"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Host Domain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/hosting" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hosting
            </Link>
            <Link href="/domains" className="text-gray-700 hover:text-blue-600 transition-colors">
              Domains
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-blue-600 transition-colors">
              Support
            </Link>
            <Link href="/customer" className="text-gray-700 hover:text-blue-600 transition-colors">
              Client Portal
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/get-started">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/hosting" className="text-gray-700 hover:text-blue-600 transition-colors">
                Hosting
              </Link>
              <Link href="/domains" className="text-gray-700 hover:text-blue-600 transition-colors">
                Domains
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link href="/customer" className="text-gray-700 hover:text-blue-600 transition-colors">
                Client Portal
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/get-started">
                  <Button className="bg-blue-600 hover:bg-blue-700 justify-start">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
