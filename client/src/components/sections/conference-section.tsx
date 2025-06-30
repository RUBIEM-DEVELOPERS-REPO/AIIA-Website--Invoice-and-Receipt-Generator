import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Calendar, MapPin, Users, ChevronRight, Phone, Mail, Sparkles, Zap, Target, Download } from "lucide-react";
import conferenceImage from "@/lib/images/conference-2025.jpg";
import brochureImage from "@/lib/images/ai-conference-speakers-brochure.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function ConferenceSection() {
  // Conference date: August 17, 2025
  const conferenceDate = new Date("2025-08-17T09:00:00Z");

  // Download brochure function
  const downloadBrochure = () => {
    const link = document.createElement('a');
    link.href = brochureImage;
    link.download = 'AI-Conference-2025-Speakers-Brochure.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic text carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const dynamicTexts = [
    {
      title: "AI for Business Leadership",
      subtitle: "Transform Your Organization",
      icon: Zap,
      color: "from-blue-400 to-purple-400"
    },
    {
      title: "500+ Industry Leaders",
      subtitle: "Join the Elite Network",
      icon: Users,
      color: "from-green-400 to-blue-400"
    },
    {
      title: "4 Days of Innovation",
      subtitle: "Shape Africa's AI Future",
      icon: Target,
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Victoria Falls Summit",
      subtitle: "Exclusive Venue Experience",
      icon: Sparkles,
      color: "from-orange-400 to-red-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 lg:py-28">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:20px_20px]"></div>
      </motion.div>
      
      {/* Moving Floating Orbs */}
      <motion.div
        className="absolute top-10 right-10 w-20 h-20 bg-blue-400/30 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 bg-purple-400/30 rounded-full blur-xl"
        animate={{
          y: [15, -15, 15],
          x: [8, -8, 8],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-lg"
        animate={{
          y: [-30, 30, -30],
          x: [20, -20, 20],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Moving Gradient Lines */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-full w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
      </motion.div>
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
      >
        <div className="h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent ml-auto"></div>
      </motion.div>

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Content Side */}
          <motion.div className="space-y-8" variants={slideInLeft}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
              variants={fadeInUp}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Upcoming Event</span>
            </motion.div>

            {/* Dynamic Animated Title */}
            <motion.div variants={fadeInUp} className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {React.createElement(dynamicTexts[currentSlide].icon, {
                        className: `w-8 h-8 text-white`
                      })}
                    </motion.div>
                    <motion.div
                      className="text-sm font-medium text-white/90 px-3 py-1 bg-white/10 rounded-full border border-white/20"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.1)",
                          "0 0 0 10px rgba(255,255,255,0)",
                          "0 0 0 0 rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      LIVE EVENT
                    </motion.div>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-2">
                    <span className={`bg-gradient-to-r ${dynamicTexts[currentSlide].color} bg-clip-text text-transparent`}>
                      {dynamicTexts[currentSlide].title}
                    </span>
                  </h2>
                  
                  <motion.p 
                    className="text-xl text-white/80 mb-4"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {dynamicTexts[currentSlide].subtitle}
                  </motion.p>
                  
                  <p className="text-lg text-white/70">August 17-20, 2025 • Victoria Falls</p>
                </motion.div>
              </AnimatePresence>
              
              {/* Slide Indicators */}
              <div className="flex justify-center lg:justify-start gap-2 mt-6">
                {dynamicTexts.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Event Details */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              <div className="flex items-center gap-3 text-white/90">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>August 17-20, 2025</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Elephant Hills, Victoria Falls</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Expected 500+ Industry Leaders</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg text-white/80 leading-relaxed"
              variants={fadeInUp}
            >
              Join Africa's premier AI conference focused on transforming business leadership
              through artificial intelligence. Connect with industry pioneers, explore cutting-edge
              solutions, and shape the future of AI-driven business transformation across Africa.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white/90 text-lg font-semibold mb-4">Event Starts In:</h3>
              <CountdownTimer targetDate={conferenceDate} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfaTEz5rXmI_iS844F6SaQF4_tvZsr5MJrcnXYtIrWO5Ff3WQ/viewform', '_blank')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Register Now
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={downloadBrochure}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Brochure
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={() => window.open('tel:+263712813500')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call for Info
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                onClick={() => window.open('mailto:events@alphamedia.co.zw')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Inquiry
              </Button>
            </motion.div>

            {/* Animated Key Topics */}
            <motion.div className="space-y-3" variants={fadeInUp}>
              <h4 className="text-white/90 font-semibold">Key Focus Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Strategy",
                  "Digital Transformation",
                  "Innovation Leadership",
                  "Sustainable Growth",
                  "African Context",
                ].map((topic, index) => (
                  <motion.span
                    key={topic}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      x: 0,
                      boxShadow: [
                        "0 0 0 0 rgba(255,255,255,0.1)",
                        "0 0 0 5px rgba(255,255,255,0.1)",
                        "0 0 0 0 rgba(255,255,255,0.1)"
                      ]
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      transition: { duration: 0.2 }
                    }}
                    transition={{ 
                      delay: index * 0.2 + 1,
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }
                    }}
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Animated Image Side */}
          <motion.div
            className="relative order-first lg:order-last"
            variants={slideInRight}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              animate={{ 
                rotateY: [0, 5, 0, -5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Animated Image Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.img
                src={conferenceImage}
                alt="AI for Business Leadership Conference 2025"
                className="relative w-full h-auto rounded-2xl border border-white/20"
                animate={{
                  filter: [
                    "brightness(1) contrast(1)",
                    "brightness(1.1) contrast(1.1)",
                    "brightness(1) contrast(1)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Moving Overlay Gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"
                animate={{
                  background: [
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent, transparent)",
                    "linear-gradient(to top, rgba(0,0,0,0.3), transparent, transparent)",
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent, transparent)"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Animated Floating Stats */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20"
              animate={{ 
                y: [0, -5, 0],
                x: [0, 2, 0],
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.1)",
                  "0 15px 35px rgba(0,0,0,0.15)",
                  "0 10px 25px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="text-2xl font-bold text-slate-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                4 Days
              </motion.div>
              <div className="text-sm text-slate-600">of Innovation</div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20"
              animate={{ 
                y: [0, 3, 0],
                x: [0, -2, 0],
                rotate: [0, 1, 0],
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.1)",
                  "0 15px 35px rgba(0,0,0,0.15)",
                  "0 10px 25px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <motion.div 
                className="text-2xl font-bold text-slate-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                50+
              </motion.div>
              <div className="text-sm text-slate-600">Expert Speakers</div>
            </motion.div>

            {/* Additional Moving Elements */}
            <motion.div
              className="absolute top-1/2 -right-4 w-3 h-3 bg-blue-400 rounded-full"
              animate={{
                y: [-20, 20, -20],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 -left-2 w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}