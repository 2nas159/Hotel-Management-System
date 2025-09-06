import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Smartphone, 
  Star, 
  Globe, 
  Users, 
  MapPin, 
  Award, 
  Plane 
} from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      id: 1,
      title: "Luxury Accommodations",
      description: "Experience unparalleled comfort in our carefully curated selection of premium hotels and resorts worldwide.",
      icon: Building2,
      features: ["Premium Room Selection", "24/7 Concierge Service", "Exclusive Amenities", "Personalized Service"]
    },
    {
      id: 2,
      title: "Seamless Booking",
      description: "Book your perfect stay with our intuitive platform designed for effortless travel planning.",
      icon: Smartphone,
      features: ["Instant Confirmation", "Real-time Availability", "Secure Payment", "Mobile Optimized"]
    },
    {
      id: 3,
      title: "Exceptional Service",
      description: "Our dedicated team ensures every aspect of your journey exceeds expectations.",
      icon: Star,
      features: ["24/7 Customer Support", "Travel Assistance", "Quality Guarantee", "Guest Reviews"]
    },
    {
      id: 4,
      title: "Global Destinations",
      description: "Discover amazing destinations with our extensive network of partner hotels worldwide.",
      icon: Globe,
      features: ["Worldwide Coverage", "Local Expertise", "Cultural Experiences", "Best Price Guarantee"]
    }
  ];

  const stats = [
    { number: "500K+", label: "Happy Guests" },
    { number: "10K+", label: "Partner Hotels" },
    { number: "150+", label: "Countries" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-6">
              Experience Excellence
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Discover a world of exceptional hospitality where every detail is crafted to create unforgettable memories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-light text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Features */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-6">
            What Makes Us Different
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            We've reimagined the hotel booking experience to be more personal, intuitive, and rewarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {experiences.map((experience, index) => {
            const IconComponent = experience.icon;
            return (
              <motion.div
                key={experience.id}
                className="group bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 ease-out border-0 hover:border border-gray-100/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-gray-900 mb-4">
                      {experience.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {experience.description}
                    </p>
                    <div className="space-y-2">
                      {experience.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-6">
              Guest Stories
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Hear from our guests about their exceptional experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, USA",
                rating: 5,
                text: "The booking process was incredibly smooth, and the hotel exceeded all my expectations. The attention to detail was remarkable."
              },
              {
                name: "Michael Chen",
                location: "Tokyo, Japan",
                rating: 5,
                text: "Outstanding service from start to finish. The platform made finding the perfect accommodation effortless."
              },
              {
                name: "Emma Rodriguez",
                location: "Barcelona, Spain",
                rating: 5,
                text: "A truly exceptional experience. The quality of hotels and the level of service provided was outstanding."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array(testimonial.rating).fill("").map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-white tracking-tight mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl text-gray-300 font-light mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests who have discovered the perfect blend of luxury, comfort, and exceptional service.
            </p>
            <motion.button 
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-sm font-medium tracking-wide uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
