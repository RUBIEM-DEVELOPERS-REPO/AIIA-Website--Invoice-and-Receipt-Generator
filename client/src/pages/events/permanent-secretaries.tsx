import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Award,
  Target,
  Briefcase,
  Globe,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PermanentSecretariesEvent() {
  const eventDate = new Date("2025-09-15T09:00:00Z");

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const agenda = [
    { time: "08:30 - 09:00", title: "Registration & Welcome Coffee", type: "networking" },
    { time: "09:00 - 09:30", title: "Opening Remarks: AI Transformation in Government", type: "keynote" },
    { time: "09:30 - 10:30", title: "Digital Government: Best Practices from Leading Nations", type: "presentation" },
    { time: "10:30 - 11:00", title: "Coffee Break & Networking", type: "break" },
    { time: "11:00 - 12:00", title: "Panel: AI Implementation Challenges in Public Sector", type: "panel" },
    { time: "12:00 - 13:00", title: "Lunch & Strategic Discussions", type: "networking" },
    { time: "13:00 - 14:00", title: "Workshop: Building AI-Ready Government Departments", type: "workshop" },
    { time: "14:00 - 14:30", title: "Q&A Session & Action Planning", type: "discussion" },
    { time: "14:30 - 15:00", title: "Closing Remarks & Next Steps", type: "closing" },
  ];

  const speakers = [
    {
      name: "Dr. Sarah Mwangi",
      title: "Director of Digital Transformation, Kenya",
      expertise: "Government Digital Strategy"
    },
    {
      name: "Prof. James Ochieng",
      title: "AI Policy Advisor, African Union",
      expertise: "AI Governance & Ethics"
    },
    {
      name: "Ms. Fatima Al-Rashid",
      title: "Chief Technology Officer, Morocco",
      expertise: "Smart Government Initiatives"
    }
  ];

  const benefits = [
    "Learn from successful AI implementations across Africa",
    "Network with fellow Permanent Secretaries and policy makers",
    "Access exclusive research and case studies",
    "Develop actionable AI strategy for your department",
    "Join the African Government AI Network",
    "Receive implementation toolkit and resources"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative py-20 px-6 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Exclusive Government Event
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Permanent Secretaries AI Summit
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Empowering African Government Leaders with AI Strategy, Implementation, 
              and Best Practices for Digital Transformation in the Public Sector
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>September 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>50+ Government Leaders</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>8:30 AM - 3:00 PM</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Request Invitation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Download Program
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Event Overview */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Overview</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A strategic gathering designed specifically for Permanent Secretaries and senior 
              government officials to explore AI opportunities in public service delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="text-center border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Strategic Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    AI strategy development for government departments and public services
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center border-green-200 dark:border-green-800">
                <CardHeader>
                  <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Practical Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Real-world case studies and implementation roadmaps from successful projects
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">African Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Solutions tailored for African government challenges and opportunities
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn from award-winning digital transformation initiatives
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Agenda */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-6 bg-gray-50 dark:bg-slate-800/50"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Agenda</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A carefully curated program designed for maximum learning and networking
            </p>
          </motion.div>

          <div className="space-y-4">
            {agenda.map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Badge 
                        variant="secondary" 
                        className="w-fit font-mono text-sm px-3 py-1"
                      >
                        {item.time}
                      </Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Key Benefits */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Gain</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              This exclusive event offers tangible benefits for government transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600"
      >
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Africa's Government AI Leaders
          </h2>
          <p className="text-xl mb-8 opacity-90">
            This is an invitation-only event for Permanent Secretaries and senior government officials.
            Spaces are limited to ensure meaningful interaction and strategic discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Request Invitation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Organizers
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            For inquiries: events@aiinstituteafrica.com | +263 712 813 500
          </p>
        </div>
      </motion.section>
    </div>
  );
}