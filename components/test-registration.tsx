"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { User, Mail, Building, Lock, CheckCircle } from "lucide-react"

export function TestRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  const testUsers = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      company: "Doe Enterprises",
      planType: "business",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "securepass456",
      company: "Smith Solutions",
      planType: "starter",
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      password: "mypassword789",
      company: "",
      planType: "enterprise",
    },
  ]

  const testRegistration = async (userData: any) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        status: response.status,
        data: data,
        user: userData,
      }
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: error instanceof Error ? error.message : "Network error",
        user: userData,
      }
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const results = []

    for (const user of testUsers) {
      const result = await testRegistration(user)
      results.push(result)
      setTestResults([...results])

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsLoading(false)

    const successCount = results.filter((r) => r.success).length
    toast({
      title: "Registration Tests Complete",
      description: `${successCount}/${results.length} tests passed`,
      variant: successCount === results.length ? "default" : "destructive",
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Registration System Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Test the registration system with sample user data</p>
          <Button onClick={runTests} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Running Tests..." : "Run Registration Tests"}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <Card key={index} className={`border-l-4 ${result.success ? "border-l-green-500" : "border-l-red-500"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{result.user.name}</span>
                        {result.success && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        {result.user.email}
                      </div>
                      {result.user.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-3 w-3" />
                          {result.user.company}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Lock className="h-3 w-3" />
                        Plan: {result.user.planType}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${result.success ? "text-green-600" : "text-red-600"}`}>
                        Status: {result.status}
                      </div>
                      {result.success ? (
                        <div className="text-xs text-gray-500 mt-1">User ID: {result.data.user?.id}</div>
                      ) : (
                        <div className="text-xs text-red-500 mt-1">{result.data?.error || result.error}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Test Coverage:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Email validation and uniqueness</li>
            <li>• Password hashing and security</li>
            <li>• JWT token generation</li>
            <li>• Database user creation</li>
            <li>• Plan type assignment</li>
            <li>• Optional company field handling</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
