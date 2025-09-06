import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Handshake, 
  Rocket, 
  Heart, 
  Building2, 
  Users, 
  Calendar,
  Target,
  Award,
  Globe
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const About = () => {
  const { setShowHotelReg, navigate } = useAppContext();

  const values = [
    {
      id: 1,
      title: "Excellence",
      description: "We strive for perfection in every interaction, ensuring our guests receive nothing but the best.",
      icon: Sparkles
    },
    {
      id: 2,
      title: "Integrity",
      description: "Transparency and honesty guide every decision we make, building trust with our partners and guests.",
      icon: Handshake
    },
    {
      id: 3,
      title: "Innovation",
      description: "We continuously evolve our platform to provide cutting-edge solutions for modern travelers.",
      icon: Rocket
    },
    {
      id: 4,
      title: "Care",
      description: "Every guest's journey matters to us, and we're committed to making each experience memorable.",
      icon: Heart
    }
  ];

  const team = [
    {
      name: "Alexandra Thompson",
      role: "Founder & CEO",
      icon: Users,
      description: "Passionate about creating exceptional travel experiences for over 15 years."
    },
    {
      name: "David Park",
      role: "Chief Technology Officer",
      icon: Target,
      description: "Leading our technical innovation with a vision for seamless digital experiences."
    },
    {
      name: "Maria Santos",
      role: "Head of Operations",
      icon: Award,
      description: "Ensuring operational excellence and maintaining our high service standards."
    },
    {
      name: "James Wilson",
      role: "Head of Partnerships",
      icon: Globe,
      description: "Building and nurturing relationships with our global network of hotel partners."
    }
  ];

  const milestones = [
    { year: "2018", event: "Company Founded", description: "Started with a vision to revolutionize hotel booking" },
    { year: "2019", event: "First 1000 Bookings", description: "Reached our first major milestone" },
    { year: "2020", event: "Global Expansion", description: "Expanded to 50 countries worldwide" },
    { year: "2021", event: "Mobile App Launch", description: "Launched our award-winning mobile application" },
    { year: "2022", event: "1M+ Happy Guests", description: "Celebrated serving over one million satisfied guests" },
    { year: "2023", event: "AI Integration", description: "Introduced AI-powered personalized recommendations" },
    { year: "2024", event: "Sustainability Focus", description: "Launched eco-friendly travel initiatives" }
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
              About Our Story
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              We're passionate about connecting travelers with exceptional accommodations while creating meaningful experiences that last a lifetime.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              To make exceptional hospitality accessible to every traveler by connecting them with carefully curated accommodations that exceed expectations. We believe that every journey should be extraordinary, and we're committed to making that vision a reality.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">Curated selection of premium hotels and resorts</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">Seamless booking experience with instant confirmation</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">24/7 customer support and travel assistance</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gray-100 rounded-3xl aspect-[4/3] flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Building2 className="w-24 h-24 text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              These core principles guide everything we do and shape the experiences we create for our guests.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.id}
                  className="text-center group hover:bg-gray-50 rounded-3xl p-6 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            The passionate individuals behind our mission to create exceptional travel experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-6 text-center hover:shadow-lg transition-all duration-300 border-0 hover:border border-gray-100/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Key milestones that have shaped our growth and commitment to excellence.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  viewport={{ 
                    once: false,
                    margin: "-100px 0px -100px 0px"
                  }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <motion.div 
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                    >
                      <motion.div 
                        className="text-2xl font-light text-gray-900 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: false }}
                      >
                        {milestone.year}
                      </motion.div>
                      <motion.h3 
                        className="text-lg font-medium text-gray-900 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: false }}
                      >
                        {milestone.event}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: false }}
                      >
                        {milestone.description}
                      </motion.p>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-lg z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: false }}
                  />
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
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
              Join Our Journey
            </h2>
            <p className="text-xl text-gray-300 font-light mb-8 max-w-2xl mx-auto">
              Be part of our mission to create exceptional travel experiences. Whether you're a guest or a partner, we'd love to connect with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="px-8 py-4 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-sm font-medium tracking-wide uppercase"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/rooms")}
              >
                Book Your Stay
              </motion.button>
              <motion.button 
                className="px-8 py-4 border border-white text-white rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm font-medium tracking-wide uppercase"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHotelReg(true)}
              >
                Partner With Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;