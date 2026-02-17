import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Sparkles, Zap, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import conferenceImage from "@/lib/images/conference-2025.jpg";

interface ConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConferenceModal({ isOpen, onClose }: ConferenceModalProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Dynamic content carousel
  const dynamicContent = [
    {
      badge: "EXCLUSIVE EVENT",
      title: "AI for Business Leadership",
      subtitle: "Transform Your Organization",
      icon: Zap,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      badge: "LIMITED SPOTS",
      title: "500+ Industry Leaders",
      subtitle: "Join the Elite Network",
      icon: Users,
      gradient: "from-green-500 to-blue-600",
    },
    {
      badge: "AUGUST 2025",
      title: "Victoria Falls Summit",
      subtitle: "Exclusive Venue Experience",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Start animation cycle
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % dynamicContent.length);
      }, 4000);

      return () => clearInterval(interval);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, dynamicContent.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Moving Background Elements */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.div
              className="absolute top-4 right-4 z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Modal Content */}
            <div className="relative">
              {/* Animated Conference Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={conferenceImage}
                  alt="AI for Business Leadership Conference 2025"
                  className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[45vh] object-cover"
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: [
                      "brightness(1) contrast(1)",
                      "brightness(1.1) contrast(1.1)",
                      "brightness(1) contrast(1)",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Animated Gradient Overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(to top, rgba(0,0,0,0.5), transparent, transparent)",
                      "linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)",
                      "linear-gradient(to top, rgba(0,0,0,0.5), transparent, transparent)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Moving Sparkles */}
                <motion.div
                  className="absolute top-1/4 left-1/4 text-white/40"
                  animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    opacity: [0.2, 0.6, 0.2],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/3 right-1/3 text-white/30"
                  animate={{
                    x: [0, -40, 0],
                    y: [0, 25, 0],
                    opacity: [0.1, 0.5, 0.1],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Dynamic Content Section */}
              <div className="p-4 sm:p-6 md:p-8 text-center relative overflow-hidden">
                {/* Background Moving Elements */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] [background-size:30px_30px]"></div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={animationPhase}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Dynamic Badge */}
                    <motion.div
                      className={`inline-flex items-center gap-2 bg-gradient-to-r ${dynamicContent[animationPhase].gradient} text-white px-4 py-2 rounded-full text-sm font-medium mb-4`}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.2)",
                          "0 0 0 10px rgba(255,255,255,0)",
                          "0 0 0 0 rgba(255,255,255,0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {React.createElement(
                          dynamicContent[animationPhase].icon,
                          {
                            className: "w-4 h-4",
                          },
                        )}
                      </motion.div>
                      {dynamicContent[animationPhase].badge}
                    </motion.div>

                    <motion.h2
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {dynamicContent[animationPhase].title}
                    </motion.h2>

                    <motion.p
                      className="text-sm sm:text-base md:text-lg text-gray-600 mb-4"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {dynamicContent[animationPhase].subtitle}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </motion.div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">
                      August 17-20, 2025
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4">
                    Elephant Hills, Victoria Falls
                  </p>
                </motion.div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    Join Africa's premier AI conference transforming business
                    leadership through artificial intelligence. Connect with
                    industry pioneers and shape the future of AI-driven business
                    transformation.
                  </p>
                </div>

                {/* Registration Contact Information */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Registration Contacts
                  </h3>

                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">
                          Wilson:
                        </span>
                        <a
                          href="tel:+263773277599"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          +263 773 277599
                        </a>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">
                          Robert:
                        </span>
                        <a
                          href="tel:+263772222283"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          +263 772 222283
                        </a>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">
                          Olivier:
                        </span>
                        <a
                          href="tel:+263772831609"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          +263 772 831609
                        </a>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">Jack:</span>
                        <a
                          href="tel:+263773417267"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          +263 773 417267
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Conference Line:
                      </span>
                      <a
                        href="tel:+263773277599"
                        className="text-blue-600 hover:text-blue-800 font-mono"
                      >
                        +263 773277599
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-gray-700 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email:
                      </span>
                      <a
                        href="mailto:events@alphamedia.co.zw"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        events@alphamedia.co.zw
                      </a>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="flex flex-col gap-2 justify-center"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
                      onClick={() => window.location.href = '/ai-africa-summit'}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Register Now
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
                      onClick={() => window.open("tel:+263773277599")}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call for Info
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm"
                      onClick={() =>
                        window.open("mailto:events@alphamedia.co.zw")
                      }
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email Inquiry
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useConferenceModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after a short delay when component mounts
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
}
