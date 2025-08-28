import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";


import WireframeAnimation from "./wireframe-animation";
import { Card } from "@/components/ui/card";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData from "@/lib/lotties/Africa.json";
import introVideo from "../../lib/videos/aiia_intro_video.mp4";

export default function Hero() {
  return (
    <div className="relative h-[100vh] overflow-hidden bg-gray-900">
      {/* Neural Network Animation Background */}
      <WireframeAnimation />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] mix-blend-overlay opacity-50 dark:opacity-40 bg-gradient-to-br from-background via-background/70 to-background/30" />

      {/* Content */}
      <div className="relative z-10 container h-full flex items-center justify-between px-8 md:px-16 gap-20">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex gap-4 items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 border border-primary/20">
              <span className="text-sm font-medium">
                Shaping Africa's AI Future
              </span>
            </div>

          </motion.div>

          <motion.h1
            className="text-5xl text-white md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Pioneering AI Innovation in Africa
          </motion.h1>

          <motion.p
            className="text-xl text-white md:text-2xl mb-8 leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Join us in building a future where African talent leads the global
            AI revolution through cutting-edge research, world-class education,
            and transformative innovation.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-all hover:scale-105 group"
            >
              <Link href="/programs" className="flex items-center gap-2">
                Explore Programs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/10 transition-all hover:scale-105 group"
            >
              <Link href="/about" className="flex items-center gap-2">
                Learn More
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              { number: "500+", label: "Students Trained" },
              { number: "50+", label: "Research Papers" },
              { number: "5+", label: "Partner Universities" },
              { number: "15", label: "African Countries" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Card */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: 0.5,
          }}
        >
          <motion.div
            animate={{
              y: [-20, 20],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1.2,
              },
            }}
          >
            <div className="space-y-6">
              {/* Video Section */}
              <Card className="w-96 p-4 bg-transparent border-none">
                <div className="space-y-3">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-48 object-cover rounded-lg border border-white/20"
                  >
                    <source src={introVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-white text-sm text-center">
                    AI Institute Africa Introduction
                  </p>
                </div>
              </Card>

              {/* Map Section */}
              <Card className="w-96 p-6 bg-transparent border-none">
                <div className="space-y-4">
                  <LottieAnimation animationData={animationData} />
                  <div className="flex items-center gap-2 text-sm text-primary"></div>
                  <p className="text-white">
                    Our Vision tells Us to Keep On Moving And Innovating
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}