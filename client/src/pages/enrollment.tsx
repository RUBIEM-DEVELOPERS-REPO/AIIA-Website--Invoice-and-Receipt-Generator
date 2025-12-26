import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Brain, 
  Cpu, 
  Bot, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Eye, 
  Zap, 
  Users, 
  Building2, 
  Laptop,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Layers,
  Target,
  TrendingUp,
  Settings,
  HeartPulse,
  Leaf,
  Lock,
  Lightbulb,
  Briefcase,
  UserCheck,
  PieChart,
  FileText,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

const diplomaPrograms = [
  {
    name: "Diploma in Artificial Intelligence and Data Science",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Brain,
    hnd: true,
  },
  {
    name: "Diploma in Machine Learning and Deep Learning",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Cpu,
    hnd: true,
  },
  {
    name: "Diploma in Robotics and Intelligent Systems",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Bot,
    hnd: true,
  },
  {
    name: "Diploma in Data Analytics and AI Applications",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: BarChart3,
    hnd: true,
  },
  {
    name: "Diploma in Natural Language Processing (NLP)",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: MessageSquare,
    hnd: true,
  },
  {
    name: "Diploma in AI for Business and Innovation",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Lightbulb,
    hnd: true,
  },
  {
    name: "Diploma in Computer Vision and Image Processing",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Eye,
    hnd: true,
  },
  {
    name: "Diploma in Ethical AI and Policy Studies",
    duration: "1 Year (2 Semesters)",
    price: "$560 per semester",
    icon: Shield,
    hnd: true,
  },
];

const shortCourses = [
  { name: "Introduction to Artificial Intelligence and Machine Learning", icon: Brain },
  { name: "AI for Business Decision-Making", icon: Target },
  { name: "Data Analytics and Visualization Using AI Tools", icon: PieChart },
  { name: "ChatGPT and Generative AI for Productivity", icon: Sparkles },
  { name: "AI for Human Resources (HR Analytics & Automation)", icon: UserCheck },
  { name: "AI in Finance and Risk Management", icon: TrendingUp },
  { name: "Machine Learning for Non-Programmers", icon: Cpu },
  { name: "AI in Marketing and Customer Insights", icon: Users },
  { name: "Responsible and Ethical AI in Organizations", icon: Shield },
  { name: "AI for Innovation and Digital Transformation", icon: Lightbulb },
  { name: "Robotic Process Automation (RPA) for Business Efficiency", icon: Workflow },
  { name: "Natural Language Processing (NLP) in Business", icon: MessageSquare },
  { name: "AI and Cybersecurity", icon: Lock },
  { name: "Data-Driven Leadership with Artificial Intelligence", icon: Briefcase },
  { name: "AI Project Implementation for Managers", icon: Settings },
  { name: "AI for Education and Learning", icon: BookOpen },
  { name: "AI for Healthcare and Diagnostics", icon: HeartPulse },
  { name: "AI Tools for Everyday Office Use", icon: Laptop },
  { name: "AI in Agriculture and Smart Farming", icon: Leaf },
  { name: "Introduction to Data Ethics and AI Policy Frameworks", icon: FileText },
];

const intensiveWorkshops = [
  {
    category: "Generative AI & Large Language Models",
    icon: Sparkles,
    courses: [
      {
        name: "Generative AI for Business Productivity",
        focus: "Leveraging tools like ChatGPT, Microsoft Copilot, and Gemini",
        idealFor: "All employees, from executives to individual contributors",
        day1: "Prompt Engineering Fundamentals, Automating Communication, Research & Summarization",
        day2: "Data Analysis with AI, Creating Presentations, Building Custom GPTs",
      },
      {
        name: "Building with Large Language Models (LLMs)",
        focus: "Technical deep dive for developers on integrating LLMs via APIs",
        idealFor: "Software Developers, Data Engineers, IT Professionals",
        day1: "LLM Architecture Overview, OpenAI & Anthropic APIs, Advanced Prompt Engineering",
        day2: "Building AI-Powered Applications, LangChain Framework, RAG Introduction",
      },
      {
        name: "AI-Powered Marketing & Content Creation",
        focus: "Using generative AI for marketing campaigns and design",
        idealFor: "Marketing Teams, Content Creators, Social Media Managers",
        day1: "AI Copywriting, Market Research with AI, SEO Optimization",
        day2: "AI for Visual Content (Midjourney, DALL-E), Video Scripts, Content Workflow",
      },
    ],
  },
  {
    category: "Data Science & Machine Learning",
    icon: BarChart3,
    courses: [
      {
        name: "Practical AI for Data Analysis",
        focus: "Using no-code/low-code AI tools to gain insights from data",
        idealFor: "Business Analysts, Financial Analysts, Project Managers",
        day1: "Data Preprocessing, Automated Exploratory Data Analysis, Pattern Recognition",
        day2: "Building Predictive Models with AutoML, Interpreting Results, Dashboards",
      },
      {
        name: "AI-Driven Strategic Decision Making",
        focus: "Using AI models for forecasting, risk assessment, and strategy",
        idealFor: "Executives, Strategy Consultants, Department Heads",
        day1: "Predictive & Prescriptive Analytics, Scenario Planning, Demand Forecasting",
        day2: "Risk Analysis, Supply Chain Optimization, AI-Augmented Decision Framework",
      },
    ],
  },
  {
    category: "Process Automation & Optimization",
    icon: Workflow,
    courses: [
      {
        name: "Intelligent Process Automation with AI",
        focus: "Going beyond traditional RPA by incorporating AI for cognitive tasks",
        idealFor: "Operations Teams, Finance & Accounting, Process Engineers",
        day1: "Introduction to IPA, Identifying Automation Opportunities, Document Processing",
        day2: "Building Workflows with Power Automate/UiPath, Handling Unstructured Data",
      },
      {
        name: "AI for Customer Service Excellence",
        focus: "Implementing AI to enhance customer support operations",
        idealFor: "Customer Support Managers, CX Teams, Operations Managers",
        day1: "Building AI Chatbots, Intent Classification, Automating Tier-1 Support",
        day2: "Sentiment Analysis, Agent Assist Tools, Bot-to-Human Handoff",
      },
    ],
  },
  {
    category: "Specialized & Technical Applications",
    icon: Eye,
    courses: [
      {
        name: "Computer Vision for Business",
        focus: "Applying image and video recognition to solve business problems",
        idealFor: "Manufacturing, Retail, Logistics, Security Teams",
        day1: "Computer Vision Fundamentals, Use Cases, Pre-trained Models",
        day2: "Building Custom Image Classifiers, Video Analytics, Ethical Considerations",
      },
      {
        name: "Responsible AI & Governance",
        focus: "Ensuring AI systems are fair, explainable, ethical, and compliant",
        idealFor: "Legal & Compliance Teams, Risk Officers, Senior Leadership",
        day1: "AI Bias & Fairness, Model Explainability (XAI), Regulatory Landscape",
        day2: "AI Ethics Framework, Governance Checklist, Case Studies",
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Enrollment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
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
              <Zap className="w-4 h-4" />
              March 2026 Intake Now Open
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              AI Course Catalogue
            </h1>
            <p className="text-xl text-cyan-200/70 max-w-3xl mx-auto">
              Empowering Africa through Artificial Intelligence Education and Innovation
            </p>
          </motion.div>

          <Tabs defaultValue="diploma" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-slate-800/50 border border-cyan-500/20 mb-8">
              <TabsTrigger value="diploma" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <GraduationCap className="w-4 h-4 mr-2" />
                Diploma Programs
              </TabsTrigger>
              <TabsTrigger value="short" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <Clock className="w-4 h-4 mr-2" />
                Short Courses
              </TabsTrigger>
              <TabsTrigger value="intensive" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <Zap className="w-4 h-4 mr-2" />
                2-Day Workshops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diploma">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {diplomaPrograms.map((program, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 h-full group" style={{ boxShadow: "0 0 20px rgba(0,255,255,0.05)" }}>
                      <CardHeader className="pb-2">
                        <motion.div
                          className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-3 border border-cyan-500/30"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <program.icon className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                        <CardTitle className="text-lg text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {program.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-4 h-4 text-cyan-500" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>{program.price}</span>
                          </div>
                          {program.hnd && (
                            <div className="flex items-center gap-2 text-purple-400 mt-3">
                              <Award className="w-4 h-4" />
                              <span className="text-xs">HND Available (2 Years)</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-500/30"
              >
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  <Layers className="w-5 h-5" />
                  Certification Pathway
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">1</span>
                    </div>
                    <p>Complete short courses to earn a Professional Certificate</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">2</span>
                    </div>
                    <p>Two certificates qualify for direct entry into Diploma Programs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">3</span>
                    </div>
                    <p>Diploma graduates can progress to HND for advanced specialization</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="short">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {shortCourses.map((course, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 h-full group cursor-pointer" style={{ boxShadow: "0 0 15px rgba(0,255,255,0.03)" }}>
                      <CardContent className="p-4">
                        <motion.div
                          className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-3 border border-cyan-500/20"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <course.icon className="w-5 h-5 text-cyan-400" />
                        </motion.div>
                        <p className="text-sm text-slate-300 group-hover:text-cyan-300 transition-colors font-medium">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>2 Days</span>
                          <span className="text-cyan-500">•</span>
                          <span>$250</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid md:grid-cols-3 gap-6"
              >
                <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/20">
                  <Laptop className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="font-bold text-slate-200 mb-2">Online</h4>
                  <p className="text-sm text-slate-400">Delivered through AIIA Virtual Learning Environment with interactive sessions</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                  <Building2 className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold text-slate-200 mb-2">Physical (On-site)</h4>
                  <p className="text-sm text-slate-400">Instructor-led training at AIIA training centres or partner institutions</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/20">
                  <Layers className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-bold text-slate-200 mb-2">Hybrid</h4>
                  <p className="text-sm text-slate-400">Combines online lectures with physical practical sessions</p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="intensive">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {intensiveWorkshops.map((category, catIndex) => (
                  <motion.div key={catIndex} variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/30"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <category.icon className="w-5 h-5 text-cyan-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {category.category}
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.courses.map((course, courseIndex) => (
                        <Card key={courseIndex} className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-cyan-300">{course.name}</CardTitle>
                            <p className="text-xs text-slate-400">{course.focus}</p>
                          </CardHeader>
                          <CardContent className="text-sm space-y-3">
                            <div>
                              <p className="text-cyan-500 font-semibold text-xs mb-1">Day 1:</p>
                              <p className="text-slate-400 text-xs">{course.day1}</p>
                            </div>
                            <div>
                              <p className="text-purple-500 font-semibold text-xs mb-1">Day 2:</p>
                              <p className="text-slate-400 text-xs">{course.day2}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-700/50">
                              <p className="text-xs text-slate-500">
                                <Users className="w-3 h-3 inline mr-1" />
                                {course.idealFor}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 border border-cyan-500/20 text-center"
            style={{ boxShadow: "0 0 40px rgba(0,255,255,0.1)" }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Laptop className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              E-Training Platform Coming Soon!
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Free introductory courses will be available online. Stay tuned for our digital learning experience.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Requirements
                </h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• O Level Certificate</li>
                  <li>• A Level Certificate</li>
                  <li>• University Degree (if any)</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Apply Now
                </h4>
                <a href="mailto:admin@aiinstituteafrica.com" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  admin@aiinstituteafrica.com
                </a>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </h4>
                <p className="text-sm text-slate-400">
                  275 Corner Herbert Chitepo & 6th Street, Harare, Zimbabwe
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wider uppercase px-8" style={{ fontFamily: "'Orbitron', sans-serif", boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Get Started Today
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
