import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Host Domain</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your profitable gateway to domains & hosting. Build your hosting business with our white-label platform.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@hostdomain.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/domains" className="hover:text-white transition-colors">
                  Domain Registration
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-white transition-colors">
                  Web Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-white transition-colors">
                  VPS Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-white transition-colors">
                  Dedicated Servers
                </Link>
              </li>
              <li>
                <Link href="/domains" className="hover:text-white transition-colors">
                  SSL Certificates
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-white transition-colors">
                  Email Hosting
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="hover:text-white transition-colors">
                  Reseller Program
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Get the latest news and updates about our services and special offers.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Host Domain. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
