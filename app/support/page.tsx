"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, Clock, CheckCircle, HelpCircle } from "lucide-react"

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email from our support team",
    responseTime: "Within 24 hours",
    availability: "24/7",
    action: "Send Email",
    color: "blue",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support agents in real-time",
    responseTime: "Instant response",
    availability: "9 AM - 6 PM EST",
    action: "Start Chat",
    color: "green",
  },
]

const faqItems = [
  {
    question: "How do I register a domain?",
    answer:
      "You can register a domain by using our domain search tool on the domains page. Simply enter your desired domain name and select from available extensions.",
  },
  {
    question: "What hosting plans do you offer?",
    answer:
      "We offer shared hosting, VPS, and dedicated server plans. Each plan comes with different resources and features to match your needs.",
  },
  {
    question: "How do I set up my hosting account?",
    answer:
      "After purchasing a hosting plan, you'll receive setup instructions via email. Your hosting account will be activated within 24 hours.",
  },
  {
    question: "Can I transfer my existing domain?",
    answer:
      "Yes, you can transfer your domain to us. The process typically takes 5-7 days and includes a free 1-year extension.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, PayPal, and cryptocurrency payments through Binance Pay.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee on all hosting plans. Domain registrations are non-refundable.",
  },
]

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setTicketForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSubmitSuccess(true)
    setIsSubmitting(false)
    setTicketForm({
      name: "",
      email: "",
      subject: "",
      category: "",
      priority: "",
      message: "",
    })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const startLiveChat = () => {
    // In a real implementation, this would open a chat widget
    alert("Live chat would open here. Integration with services like Intercom, Zendesk, or custom chat solution.")
  }

  const sendEmail = () => {
    window.location.href = "mailto:support@hostdomain.com?subject=Support Request"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the help you need with our comprehensive support options. We're here to assist you 24/7.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`bg-${channel.color}-100 dark:bg-${channel.color}-900 p-3 rounded-lg`}>
                    <channel.icon className={`h-6 w-6 text-${channel.color}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {channel.availability}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{channel.responseTime}</span>
                </div>
                <Button className="w-full" onClick={channel.title === "Live Chat" ? startLiveChat : sendEmail}>
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Support Ticket Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Submit a Support Ticket</h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Your support ticket has been submitted successfully!</span>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={ticketForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={ticketForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={ticketForm.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="domain">Domain Issues</SelectItem>
                          <SelectItem value="hosting">Hosting Support</SelectItem>
                          <SelectItem value="billing">Billing Questions</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={ticketForm.priority}
                        onValueChange={(value) => handleInputChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Please describe your issue in detail..."
                      value={ticketForm.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>support@hostdomain.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span>Live Chat: 9 AM - 6 PM EST</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Email Support: 24/7</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
