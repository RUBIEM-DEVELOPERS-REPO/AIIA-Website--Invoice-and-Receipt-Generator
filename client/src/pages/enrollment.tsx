import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Brain, 
  Users, 
  Building2, 
  Laptop,
  Sparkles,
  ArrowRight,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Layers,
  Target,
  Briefcase,
  Monitor,
  FileText,
  Zap,
  Star,
  CheckCircle2,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

const shortCourses = [
  {
    name: "Master AI for Directors",
    duration: "1.5 Days",
    target: "Directors and C-suite",
    format: "Physical training",
    price: "USD 310 / person",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245,158,11,0.3)",
  },
  {
    name: "Master AI for Executives",
    duration: "2 Days",
    target: "Executives and Management",
    format: "Physical training",
    price: "USD 280 / person",
    icon: Briefcase,
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(0,255,255,0.3)",
  },
  {
    name: "Master AI for Professionals",
    duration: "3 Days",
    target: "Professional development",
    format: "Physical and Online training",
    price: "USD 280 / person",
    icon: Users,
    color: "from-purple-500 to-pink-600",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.3)",
  },
];

const certificates = [
  {
    name: "AI Postgraduate Certificate",
    subtitle: "Entry Level AI Certificate",
    duration: "4 months",
    format: "Online and Physical",
    modules: "8 Modules",
    requirement: "Bachelor's Degree",
    price: "USD 155 / Module",
    icon: Award,
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16,185,129,0.3)",
  },
  {
    name: "AI Professional Certificate",
    subtitle: "Entry Level AI Certificate",
    duration: "4 months",
    format: "Online and Physical",
    modules: "8 Modules",
    requirement: "O Level",
    price: "USD 155 / Module",
    icon: Star,
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30",
    glowColor: "rgba(59,130,246,0.3)",
  },
  {
    name: "AI Expert Certification",
    subtitle: "Technical AI Experts",
    duration: "6 months",
    format: "Online and Physical",
    modules: "10 Modules",
    requirement: "O Level",
    price: "USD 140 / Module",
    icon: Zap,
    color: "from-rose-500 to-red-600",
    borderColor: "border-rose-500/30",
    glowColor: "rgba(244,63,94,0.3)",
  },
];

const diplomas = [
  {
    name: "AI Postgraduate Diploma",
    subtitle: "Qualifications Advancement",
    duration: "8 months",
    format: "Online and Physical",
    modules: "8 Modules",
    requirement: "Bachelor's Degree",
    price: "USD 160 / Module",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139,92,246,0.3)",
  },
  {
    name: "AI Diploma",
    subtitle: "Qualifications Advancement",
    duration: "8 months",
    format: "Online and Physical",
    modules: "8 Modules",
    requirement: "3 A Levels",
    price: "USD 160 / Module",
    icon: BookOpen,
    color: "from-sky-500 to-cyan-600",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(14,165,233,0.3)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
};

const rotateAnimation = {
  rotate: [0, 360],
  transition: { duration: 20, repeat: Infinity, ease: "linear" }
};

export default function Enrollment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <motion.div
        className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full"
        animate={{ x: [0, 100, 0], y: [0, 50, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full"
        animate={{ x: [0, -80, 0], y: [0, 80, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-2 h-2 bg-pink-400 rounded-full"
        animate={{ x: [0, 60, 0], y: [0, -40, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"
          animate={rotateAnimation}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 tracking-wider uppercase"
              animate={{ boxShadow: ["0 0 20px rgba(0,255,255,0.3)", "0 0 40px rgba(0,255,255,0.5)", "0 0 20px rgba(0,255,255,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Zap className="w-4 h-4" />
              </motion.div>
              March 2026 Intake Now Open
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4" 
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              AI Course Catalogue
            </motion.h1>
            <motion.p 
              className="text-xl text-cyan-200/70 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Empowering Africa through Artificial Intelligence Education and Innovation
            </motion.p>
          </motion.div>

          <Tabs defaultValue="short" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-slate-800/50 border border-cyan-500/20 mb-8">
              <TabsTrigger value="short" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Clock className="w-4 h-4 mr-2" />
                </motion.div>
                Short Courses
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Award className="w-4 h-4 mr-2" />
                </motion.div>
                Certificates
              </TabsTrigger>
              <TabsTrigger value="diplomas" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <motion.div whileHover={{ rotate: 15 }}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                </motion.div>
                Diplomas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="short">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-8"
              >
                {shortCourses.map((course, index) => (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                    <Card 
                      className={`bg-slate-800/50 ${course.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${course.glowColor}` }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity"
                        style={{ backgroundImage: `linear-gradient(to bottom right, ${course.color.split(' ')[0].replace('from-', '')}, transparent)` }}
                      />
                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <course.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl text-slate-100 group-hover:text-white transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {course.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span>{course.duration}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            <Users className="w-5 h-5 text-purple-400" />
                            <span>{course.target}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                          >
                            <Building2 className="w-5 h-5 text-blue-400" />
                            <span>{course.format}</span>
                          </motion.div>
                        </div>
                        <motion.div 
                          className={`mt-6 pt-4 border-t border-slate-700/50`}
                          animate={pulseAnimation}
                        >
                          <div className={`text-2xl font-bold bg-gradient-to-r ${course.color} bg-clip-text text-transparent`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            {course.price}
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="certificates">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-8"
              >
                {certificates.map((cert, index) => (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                    <Card 
                      className={`bg-slate-800/50 ${cert.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${cert.glowColor}` }}
                    >
                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <cert.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl text-slate-100 group-hover:text-white transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {cert.name}
                        </CardTitle>
                        <p className="text-sm text-cyan-400/80">{cert.subtitle}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ x: 5 }}
                          >
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <span>{cert.duration}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ x: 5 }}
                          >
                            <Globe className="w-5 h-5 text-purple-400" />
                            <span>{cert.format}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ x: 5 }}
                          >
                            <Layers className="w-5 h-5 text-blue-400" />
                            <span>{cert.modules}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ x: 5 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>{cert.requirement}</span>
                          </motion.div>
                        </div>
                        <motion.div 
                          className="mt-6 pt-4 border-t border-slate-700/50"
                          animate={pulseAnimation}
                        >
                          <div className={`text-2xl font-bold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            {cert.price}
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="diplomas">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {diplomas.map((diploma, index) => (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                    <Card 
                      className={`bg-slate-800/50 ${diploma.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${diploma.glowColor}` }}
                    >
                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-20 h-20 rounded-xl bg-gradient-to-br ${diploma.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <diploma.icon className="w-10 h-10 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl text-slate-100 group-hover:text-white transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {diploma.name}
                        </CardTitle>
                        <p className="text-sm text-purple-400/80">{diploma.subtitle}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <span>{diploma.duration}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Globe className="w-5 h-5 text-purple-400" />
                            <span>{diploma.format}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Layers className="w-5 h-5 text-blue-400" />
                            <span>{diploma.modules}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 text-slate-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>{diploma.requirement}</span>
                          </motion.div>
                        </div>
                        <motion.div 
                          className="mt-6 pt-4 border-t border-slate-700/50"
                          animate={pulseAnimation}
                        >
                          <div className={`text-3xl font-bold bg-gradient-to-r ${diploma.color} bg-clip-text text-transparent`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            {diploma.price}
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 border border-cyan-500/20 text-center relative overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(0,255,255,0.1)" }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div animate={pulseAnimation}>
              <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Start Your AI Journey Today
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join the next generation of AI professionals. Applications for March 2026 intake are now open.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <motion.div 
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{ scale: 1.02, borderColor: "rgba(0,255,255,0.5)" }}
              >
                <motion.div animate={floatAnimation}>
                  <FileText className="w-8 h-8 text-cyan-400 mb-3" />
                </motion.div>
                <h4 className="font-bold text-cyan-300 mb-2">Requirements</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> O Level Certificate</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> A Level Certificate</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> University Degree (if any)</li>
                </ul>
              </motion.div>
              <motion.div 
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{ scale: 1.02, borderColor: "rgba(168,85,247,0.5)" }}
              >
                <motion.div animate={floatAnimation}>
                  <Mail className="w-8 h-8 text-purple-400 mb-3" />
                </motion.div>
                <h4 className="font-bold text-purple-300 mb-2">Apply Now</h4>
                <a href="mailto:admin@aiinstituteafrica.com" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                  admin@aiinstituteafrica.com
                </a>
              </motion.div>
              <motion.div 
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{ scale: 1.02, borderColor: "rgba(236,72,153,0.5)" }}
              >
                <motion.div animate={floatAnimation}>
                  <MapPin className="w-8 h-8 text-pink-400 mb-3" />
                </motion.div>
                <h4 className="font-bold text-pink-300 mb-2">Location</h4>
                <p className="text-sm text-slate-400">
                  275 Corner Herbert Chitepo & 6th Street, Harare, Zimbabwe
                </p>
              </motion.div>
            </div>

            <motion.div 
              className="mt-8"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold tracking-wider uppercase px-10 py-6 text-lg" 
                  style={{ fontFamily: "'Orbitron', sans-serif", boxShadow: "0 0 30px rgba(0,255,255,0.4)" }}
                >
                  <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </motion.div>
                  Enroll Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
