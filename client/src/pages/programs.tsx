import { PROGRAMS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData from "@/lib/lotties/enroll.json";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import LoginDialog from "@/components/auth/login-dialog";

import programImage1 from "@/lib/programs/training_2.png";
import programImage2 from "@/lib/programs/training_1.png";
import programImage3 from "@/lib/programs/training_3.png";
import programImage4 from "@/lib/programs/training_4.png";

import heroImage from "@/lib/hero_images/prog.jpg";

export default function Programs() {
  const [, setLocation] = useLocation();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    setIsAuthenticated(!!userData);
  }, []);

  const handleEnrollClick = () => {
    if (isAuthenticated) {
      setLocation("/application");
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Programs
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Comprehensive AI education and research programs designed to nurture
            talent and drive innovation across Africa.
          </p>
        </div>
      </section>

      {/* Programs Content */}
      <section className="py-16 w-full px-4">
        <Tabs defaultValue="fundamentals" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 w-full divide-y divide-border/50 sm:divide-y-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 col-span-full">
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="fundamentals"
              >
                AI Fundamentals
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="strategy"
              >
                AI for Professionals
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="transformation"
              >
                AI for Law and Justice
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="tech_experts"
              >
                AI for Technical Experts
              </TabsTrigger>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 col-span-full border-t border-border/50 pt-1.5">
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="management"
              >
                Master AI for Management
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="education"
              >
                Master AI for Education
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="practitioners"
              >
                AI for HR Practitioners
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-center h-auto py-2 px-4 text-sm md:text-base"
                value="directors"
              >
                AI for Board of Directors
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="fundamentals" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>AI Fundamentals for Executives</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage1} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: C-Level Leadership (CEO, CTO, CFO, CMO, COO, CHRO,
                      HoD )
                    </li>
                    <li>Duration: 2 Days</li>
                    <li>Venue: Convinient to Clients</li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    AI for Visionary Executives: Strategy, Transformation,
                    Implementation & Governance This course equips
                    forward-thinking executives to harness AI for organizational
                    and digital transformation, driving efficiency, innovation,
                    and growth. Explore AI’s impact on humanity, future
                    projections, and its role in shaping global, continental,
                    and national socio-economic development. Master AI strategy,
                    policy development, governance and implementation.
                    Appreciate how to build an achievable business cases for
                    adoption. Designed for C-suite leaders and decision-makers,
                    this program ensures you match the rapidly changing
                    technology driven world and lead AI- driven transformation
                    with confidence and foresight.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: Introduction to AI</li>
                    <li>Module 2: AI Technical Foundation</li>
                    <li>Module 3: AI for Business Transformation</li>
                    <li>Module 4: AI Implementation</li>
                    <li>Module 5: AI Ethics and Governance</li>
                    <li>Module 6: Data Transformation for AI</li>
                    <li>Module 7:Al Tools for Executives</li>
                    <li>Module 8: Al Impact of Jobs and Work</li>
                    <li>Module 9: Al Impact on Cyber Security</li>
                    <li>Module 10: Al Future and Humanity</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-secondary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Master AI for Profesionals</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage2} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Target: Management and Professionals</li>
                    <li>Duration: 2 Days</li>
                    <li>Venue: Convinient to Clients</li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    Master AI for Professionals: Strategy, Application &
                    Transformation Results This course provides frontier
                    professionals with a solid conceptual understanding of AI
                    while emphasizing practical application for real-world
                    impact. Learn how AI drives organizational and digital
                    transformation, enhancing efficiency, innovation, and
                    growth. Explore AI’s strategic role in shaping global,
                    national, and industry landscapes, and develop skills in
                    formulating and implementing effective AI strategies. Gain
                    practical insights into AI policy development, governance,
                    and building achievable business cases for adoption.
                    Designed for professionals seeking to lead AI-driven change,
                    this program helps leverage AI effectively and confidently
                    in an ever-evolving, technology-driven world.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: Introduction to AI</li>
                    <li>Module 2: AI Technical Foundation</li>
                    <li>Module 3: AI for Business Transformation</li>
                    <li>Module 4: AI Implementation</li>
                    <li>Module 5: AI Ethics and Governance</li>
                    <li>Module 6: AI Case Study</li>
                    <li>Module 7: Data Transformation for AI</li>
                    <li>Module 8: AI Tools for Professionals</li>
                    <li>Module 9: AI Impact of Jobs and Work</li>
                    <li>Module 10: AI Impact on Cyber Security</li>
                    <li>Module 11: AI Future and Humanity</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-secondary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transformation" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>
                  Master AI for Law and Justice
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage3} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: lawyers, legal professionals, policymakers, and
                      law students
                    </li>
                    <li>Duration: 2 Days</li>
                    <li>
                      Venue: Convenient to Clients (Hybrid Online and Physical)
                    </li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    Artificial Intelligence (AI) is transforming the legal
                    profession and justice system, automating tasks, enhancing
                    research, and improving decision-making. However, AI also
                    introduces challenges such as ethical concerns, data privacy
                    issues, and regulatory uncertainties. This course provides a
                    comprehensive understanding of AI’s role in law and justice,
                    covering its applications, ethical implications, and legal
                    frameworks. Participants will explore AI-powered legal
                    research, contract analysis, predictive analytics, and AI’s
                    impact on cyber law, criminal justice, and dispute
                    resolution. By the end of this course, participants will: ✅
                    Understand AI fundamentals and its applications in legal
                    practice. ✅ Explore AI-driven tools for legal research,
                    case analysis, and contract management. ✅ Analyze AI’s
                    impact on cyber law, data privacy, and intellectual
                    property. ✅ Examine ethical challenges and biases in
                    AI-based legal decision-making. ✅ Understand AI regulations
                    and compliance requirements in law and justice.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Module 1: Introduction to Artificial Intelligence (AI) in
                      Law
                    </li>
                    <li>Module 2: History and Evolution of AI in Law</li>
                    <li>Module 3: Al and Legal Ethics</li>
                    <li>
                      Module 4: AI's Impact on Cyber Law and Digital Crimes
                    </li>
                    <li>Module 5: AI in the Criminal Justice System</li>
                    <li>Module 6: AI, Data Protection, and Privacy Laws</li>
                    <li>Module 7: AI and Contract Law</li>
                    <li>Module 8: AI in Intellectual Property (IP) Law</li>
                    <li>Module 9: Al and Dispute Resolution</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech_experts" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>
                  Advanced AI for Technical Experts.
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage4} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: : AI Engineers, AI Solutions Developers, Data
                      Engineers, Data Scientists, Software Developers
                    </li>
                    <li>Duration: 2 Months</li>
                    <li>
                      Venue: Convenient to Clients (Hybrid Online and Physical)
                    </li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    This intensive course equips technical experts with in-depth
                    knowledge of AI, empowering them to develop and implement AI
                    solutions in real-world scenarios. The program is designed
                    to cover essential concepts and hands-on skills that will
                    enable participants to take AI projects from ideation to
                    deployment.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: AI Fundamentals and Core Concepts</li>
                    <li>Module 2: Data Science and Data Engineering for AI</li>
                    <li>Module 3: Advanced Machine Learning Techniques</li>
                    <li>Module 4: Deep Learning and Neural Networks</li>
                    <li>
                      Module 5: Natural Language Processing (NLP) for AI
                      Applications
                    </li>
                    <li>Module 6: AI Solution Development and Architecture</li>
                    <li>Module 7: Implementing and Deploying AI Solutions</li>
                    <li>Module 8: AI Ethics, Security, and Future Trends</li>
                    <li>
                      Module 9: AI Frameworks, Technologies, and Open Source
                      Solutions
                    </li>
                    <li>
                      Module 10: Algorithm Selection, Coding, Training, and
                      Model Validation
                    </li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-800 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Master AI for Management</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage4} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Target: : Management and Professionals</li>
                    <li>Duration: 2 Days</li>
                    <li>Venue: Convenient to Clients</li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    This course provides frontier professionals with a solid
                    conceptual understanding of AI while emphasizing practical
                    application for real-world impact. Learn how AI drives
                    organizational and digital transformation, enhancing
                    efficiency, innovation, and growth. Explore AI’s strategic
                    role in shaping global, national, and industry landscapes,
                    and develop skills in formulating and implementing effective
                    AI strategies. Gain practical insights into AI policy
                    development, governance, and building achievable business
                    cases for adoption. Designed for professionals seeking to
                    lead AI-driven change, this program helps leverage AI
                    effectively and confidently in an ever-evolving,
                    technology-driven world.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: Introduction to AI</li>
                    <li>Module 2: AI Technical Foundations</li>
                    <li>Module 3: AI for Business Transformation</li>
                    <li>Module 4: AI Implementation</li>
                    <li>Module 5: AI Ethics and Governance</li>
                    <li>Module 6: AI Case Study</li>
                    <li>Module 7: Data Transformation for AI</li>
                    <li>Module 8: Al Tools for Professionals</li>
                    <li>Module 9: Al Impact of Jobs and Work</li>
                    <li>Module 10: Al Impact on Cyber Security</li>
                    <li>Module 11: Al Future and Humanity</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-800 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Master AI for Education</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage4} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: Educators, Students, Education Policy Makers,
                      Education Demonstrators
                    </li>
                    <li>Duration: 3 Days</li>
                    <li>
                      Venue: Convenient to Clients (Hybrid Online and Physical)
                    </li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    Artificial Intelligence (AI) is transforming education by
                    personalizing learning, automating administrative tasks, and
                    enhancing student engagement. This course explores how AI is
                    transforming teaching, assessment, and institutional
                    management while addressing ethical, privacy, and
                    accessibility concerns. We will examine he integration of AI
                    into curriculums, and how it shapes the future of schooling
                    across all levels—from primary education to universities. We
                    will also focus on the evolving skills that students need,
                    and how educators should adapt. The course will also cover
                    AI-driven tools, adaptive learning platforms, and the future
                    of AI in education.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: Introduction to AI in Education</li>
                    <li>Module 2: AI in Teaching and Learning Methods</li>
                    <li>Module 3: Benefits of AI in Education</li>
                    <li>
                      Module 4: Weaknesses and Challenges of AI in Education
                    </li>
                    <li>
                      Module 5: Changes Required in the Current Education System
                      for AI Integration
                    </li>
                    <li>Module 6: AI in Primary and Secondary Education</li>
                    <li>
                      Module 7: AI in High School and University Education
                    </li>
                    <li>
                      Module 8: The Future of Work and the Role of AI in
                      Education
                    </li>
                    <li>Module 9: The Half-Life of Skills in the AI Age</li>
                    <li>Module 10: The Role of Schools in Al Education</li>
                    <li>
                      Module 11: Teaching and Learning Methods in the Age of AI
                    </li>
                    <li>
                      Module 12: AI's Impact on Assessment and Examinations
                    </li>
                    <li>Module 13: The Role of Teachers in the Al Age</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-800 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practitioners" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>AI for HR Practitioners</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage4} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: : Chief HR Officers, HR Directors, HR Managers, HR
                      Consultants and HR Practitioners
                    </li>
                    <li>Duration: 6 Weeks</li>
                    <li>
                      Venue: Convenient to Clients (Hybrid Online and Physical)
                    </li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    This intensive course equips HR Practitioners with in-depth
                    knowledge of AI, empowering them to develop and implement
                    AI-powered HR strategies in real-world scenarios. The
                    program is designed to cover essential concepts and hands-on
                    skills that will enable participants to take AI projects
                    from ideation to deployment. Participants will understand
                    how AI impacts jobs, employment, recruitment, talent
                    management, productivity and compensation and benefits. In
                    addition, the AI impact on labor Unions and industrial
                    relations are covered.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: AI Fundamentals and Core Concepts</li>
                    <li>Module 2: AI's Impact on Jobs and Employment</li>
                    <li>Module 3: Advanced Machine Learning Techniques</li>
                    <li>Module 4: AI in Recruitment and Talent Acquisition</li>
                    <li>
                      Module 5: Al Training & Intelligence in the Workplace
                    </li>
                    <li>
                      Module 6: AI and Productivity: The Science Behind
                      Efficiency Gains
                    </li>
                    <li>Module 7: Implementing and Deploying AI Solutions</li>
                    <li>Module 8: AI Ethics, Security, and Future Trends</li>
                    <li>
                      Module 9: AI and the Future of Labor Relations, Employment
                      Laws, and Industrial Relations
                    </li>
                    <li>
                      Module 10: The Future of Al in HR and Human Capital
                      Management
                    </li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-800 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directors" className="mt-8 space-y-8">
            <Card className="p-0 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>AI for Board of Directors</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-start p-6">
                <img
                  src={programImage4} // Production path
                  alt="Description of image"
                  className="w-auto h-18 object-cover" // Adjust size as needed
                />
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Target: : Board of Directors, Shareholders and
                      Non-Executive
                    </li>
                    <li>Duration: 2 Days</li>
                    <li>
                      Venue: Convenient to Clients (Hybrid Online and Physical)
                    </li>
                  </ul>
                  <h3 className="font-semibold">Course Overview</h3>
                  <p>
                    This course explores how Artificial Intelligence (AI) is
                    reshaping corporate governance, board oversight, and
                    executive decision-making. It equips board members with the
                    skills, tools, and strategies to govern effectively in an
                    AI-driven world. This course enables leaders to see beyond
                    the digital transformation frontiers. It explores AI's
                    impact on humanity, future projections, and its role in
                    shaping global, continental, and national socio-economic
                    development. It ensures you measure-up to the rapidly
                    changing technology driven world and lead AI-driven
                    transformation with confidence and foresight.
                  </p>
                  <h3 className="font-semibold">Modules:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Module 1: Defining Artificial Intelligence (AI)</li>
                    <li>Module 2: AI Disruption and Its Impact on Boards</li>
                    <li>
                      Module 3: AI-Driven Changes to Board Processes and
                      Governance
                    </li>
                    <li>Module 4: Essential AI Skills for Board Members</li>
                    <li>
                      Module 5: AI and Strategic Planning in the Boardroom
                    </li>
                    <li>Module 6: Regulatory Compliance and AI Governance</li>
                    <li>Module 7: AI Productivity Tools for Board Members</li>
                    <li>Module 8: Cybersecurity in the Age of AI</li>
                  </ul>
                  <a
                    href="/forms"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center px-4 py-2 bg-purple-800 text-white rounded hover:bg-primary-dark w-40"
                  >
                    Enroll Today
                    <div className="w-5 h-5 ml-2">
                      <LottieAnimation animationData={animationData} />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}