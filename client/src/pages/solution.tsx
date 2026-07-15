
import TeamCard from "@/components/sections/team-card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData from "@/lib/lotties/enterprise.json";
import animationData2 from "@/lib/lotties/drone.json";
import animationData3 from "@/lib/lotties/together.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Cpu,
  Network,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { Star } from "lucide-react";

import magayaImage from "@/lib/team/magaya.jpg";
import rubiemImage from "@/lib/logos/rubiem.png";

export default function Team() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <LottieAnimation
            animationData={animationData}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container px-8">
          <motion.h1
            className="text-4xl md:text-7xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Collaborate with us And Achieve Your Dreams
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let's Elevate Your Business With AI tools and solutions
          </motion.p>
        </div>
      </section>

      {/* AI Solutions Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - AI Solutions */}
            <div>
              <h2 className="text-4xl font-bold mb-6">AI Solutions</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Transform your business with our cutting-edge AI solutions
                designed specifically for African enterprises. Book your
                Solution Today!
              </p>
              <div className="space-y-6">
                <Link href="/contact">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-primary/10 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Brain className="h-8 w-8 text-primary" />
                        <CardTitle>AI Enhanced Business Solutions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        AI can integrate with your existing business solutions
                        to allow you to offer a superior service to your
                        customers. Book your Solution Today!
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/contact">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-primary/10 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Cpu className="h-8 w-8 text-primary" />
                        <CardTitle>Risk Management Solutions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Use AI to enhance your risk management with trained and
                        tested models that can enhance your risk management
                        practices. Book your Solution Today!
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/contact">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:bg-primary/10 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Bot className="h-8 w-8 text-primary" />
                        <CardTitle>Chatbots</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Deploy chatbots to interact with your clients, provide
                        24/7 support. Book your Solution Today!
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Right Column - Why Choose Us */}
            <div className="relative lg:min-h-[600px]">
              {/* Floating Cards */}

              <motion.div
                className="absolute -top-10 right-4 z-10 hidden lg:block"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2,
                }}
              >
                <div className="flex justify-end">
                  <Card className="w-64 h-auto bg-gradient-to-transparent from-primary/20 to-primary/20 backdrop-transparent border border-transparent">
                    <CardContent className="p-4">
                      <LottieAnimation
                        animationData={animationData2}
                        className="w-full h-full object-cover opacity-30"
                      />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-0 right-20 z-20 hidden lg:block"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 1.9,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2.5,
                }}
              >
                <Card className="w-auto h-48 bg-gradient-to-transparent  backdrop-transparent border-transparent">
                  <CardContent className="p-4">
                    <LottieAnimation
                      animationData={animationData3}
                      className="w-full h-full object-cover opacity-30"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <Card className="h-full bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold mb-6">
                    Why Choose Us?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl text-muted-foreground mb-12">
                    Partner with us for AI excellence tailored to African needs.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">
                          African-focused AI Solutions
                        </h3>
                        <p className="text-muted-foreground">
                          Solutions designed specifically for African market
                          dynamics and challenges.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">
                          Expert AI Research Team
                        </h3>
                        <p className="text-muted-foreground">
                          World-class researchers with deep understanding of AI
                          applications.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">
                          Customized Implementation
                        </h3>
                        <p className="text-muted-foreground">
                          Tailored solutions that match your specific business
                          needs and goals.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <ArrowRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">
                          Ongoing Support & Training
                        </h3>
                        <p className="text-muted-foreground">
                          Comprehensive support and knowledge transfer to ensure
                          success.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background/50 flex flex-col items-center ">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from organizations across Africa that have transformed their
              operations with our AI solutions.
            </p>
          </div>
          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full h-full flex items-stretch">
              <CardContent className="pt-6 flex-grow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="text-lg mb-6">
                  "The team at AIIA went above and beyond to understand our
                  business needs and deliver a tailored AI solution that
                  exceeded our expectations. Their expertise and dedication, and
                  we couldn’t be happier with the result."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <img
                      src={magayaImage} // Replace with your image path
                      alt="Magaya"
                      className="w-14 h-14 object-cover" // Adjust size as needed
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Dennis Magaya</p>
                    <p className="text-sm text-muted-foreground">Rubiem</p>
                  </div>
                </div>
              </CardContent>
              <div className="w-1/4 flex-shrink-0 h-full">
                <img
                  src={rubiemImage} // Replace with your image path
                  alt="Rubiem Logo"
                  className="h-full w-auto object-cover" // Adjust to maintain aspect ratio
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-primary/5 flex flex-col items-center">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals passionate about AI
            and its potential to transform Africa. Check our current openings or
            send us your CV.
          </p>
          <a
            href="mailto:careers@aiiafrica.org"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View Openings
          </a>
        </div>
      </section>
    </div>
  );
}
