import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStart Solutions",
    content:
      "Host Domain has transformed our hosting business. The white-label platform is incredibly professional and our profit margins have increased by 40%.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    company: "Digital Agency Pro",
    content:
      "The API integration is seamless and the customer support is outstanding. We've been able to scale our hosting services without any technical headaches.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    company: "WebCraft Studios",
    content:
      "Amazing platform with excellent uptime. Our clients love the professional dashboard and we love the automated billing system.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Partners Say</h2>
          <p className="text-xl text-gray-600">
            Join thousands of successful hosting businesses powered by Host Domain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
