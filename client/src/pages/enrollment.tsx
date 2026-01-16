import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  BookOpen,
  Brain,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Mail,
  MapPin,
  Calendar,
  Award,
  Layers,
  Target,
  Briefcase,
  FileText,
  Zap,
  Star,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { programImages } from "@/lib/programs";

/**
 * PROGRAM IMAGES MAPPING (from your provided files)
 * programImages.catalogue       -> IMG-20260115-WA0114.jpg
 * programImages.basic           -> IMG-20260115-WA0115.jpg
 * programImages.nongrad         -> IMG-20260115-WA0116.jpg
 * programImages.gradCert        -> IMG-20260115-WA0117.jpg
 * programImages.advanced        -> IMG-20260115-WA0118.jpg
 * programImages.masterOrgs      -> IMG-20260115-WA0119.jpg
 * programImages.aiDiploma       -> IMG-20260115-WA0120.jpg
 * programImages.postgradDiploma -> IMG-20260115-WA0063.jpg
 */

/**
 * Used by enrollment multi-select
 */
const programOptions = [
  { id: "dir", name: "Master AI for Directors", category: "Short Course", image: programImages.masterOrgs },
  { id: "exec", name: "Master AI for Executives", category: "Short Course", image: programImages.masterOrgs },
  { id: "prof", name: "Master AI for Professionals", category: "Short Course", image: programImages.masterOrgs },

  { id: "basic", name: "Basic AI Certification", category: "Certificate", image: programImages.basic },
  { id: "nongrad", name: "Non-Graduate AI Certificate", category: "Certificate", image: programImages.nongrad },
  { id: "gradcert", name: "Graduate AI Certificate Program", category: "Certificate", image: programImages.gradCert },
  { id: "advanced", name: "Advanced AI Certification", category: "Certificate", image: programImages.advanced },

  { id: "aidip", name: "AI Diploma Program", category: "Diploma", image: programImages.aiDiploma },
  { id: "postgrad", name: "Postgrad AI Diploma Program", category: "Diploma", image: programImages.postgradDiploma },
] as const;

const shortCourses = [
  {
    id: "dir",
    name: "Master AI for Directors",
    duration: "1.5 Days",
    target: "Directors and C-suite",
    format: "Physical training",
    price: "USD 310 / person",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245,158,11,0.3)",
    image: programImages.masterOrgs,
  },
  {
    id: "exec",
    name: "Master AI for Executives",
    duration: "2 Days",
    target: "Executives and Management",
    format: "Physical training",
    price: "USD 280 / person",
    icon: Briefcase,
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(0,255,255,0.3)",
    image: programImages.masterOrgs,
  },
  {
    id: "prof",
    name: "Master AI for Professionals",
    duration: "3 Days",
    target: "Professional development",
    format: "Physical and Online training",
    price: "USD 280 / person",
    icon: Users,
    color: "from-purple-500 to-pink-600",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.3)",
    image: programImages.masterOrgs,
  },
];

const certificates = [
  {
    id: "gradcert",
    name: "Graduate AI Certificate Program",
    subtitle: "Elevate Your Career in Artificial Intelligence!",
    duration: "6 Weeks",
    format: "Online & Physical",
    modules: "8 Modules",
    requirement: "Bachelor's Degree",
    price: "USD 180 / Module",
    icon: Award,
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16,185,129,0.3)",
    image: programImages.gradCert,
  },
  {
    id: "nongrad",
    name: "Non-Graduate AI Certificate",
    subtitle: "Begin Your AI Journey — No Degree Required!",
    duration: "12 Weeks",
    format: "Flexible learning",
    modules: "8 Modules",
    requirement: "A Level or Employer's Letter",
    price: "USD 450",
    icon: Star,
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30",
    glowColor: "rgba(59,130,246,0.3)",
    image: programImages.nongrad,
  },
  {
    id: "basic",
    name: "Basic AI Certification",
    subtitle: "Jumpstart Your Career in AI",
    duration: "Flexible",
    format: "Flexible schedule",
    modules: "4 Modules",
    requirement: "No requirements",
    price: "USD 450",
    icon: Zap,
    color: "from-rose-500 to-red-600",
    borderColor: "border-rose-500/30",
    glowColor: "rgba(244,63,94,0.3)",
    image: programImages.basic,
  },
  {
    id: "advanced",
    name: "Advanced AI Certification",
    subtitle: "Master AI & Lead the Future",
    duration: "Flexible",
    format: "Online",
    modules: "4 Modules",
    requirement: "No requirements",
    price: "USD 500",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139,92,246,0.3)",
    image: programImages.advanced,
  },
];

const diplomas = [
  {
    id: "postgrad",
    name: "Postgrad AI Diploma Program",
    subtitle: "Specialized AI training for Bachelor’s Degree holders",
    duration: "6 Months",
    format: "Physical & Online",
    modules: "8 Modules",
    requirement: "Bachelor's Degree",
    price: "USD 120 / Module",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139,92,246,0.3)",
    image: programImages.postgradDiploma,
  },
  {
    id: "aidip",
    name: "AI Diploma Program",
    subtitle: "Begin Your Career in Artificial Intelligence!",
    duration: "18 Months",
    format: "Online & Physical Classes",
    modules: "12 Modules",
    requirement: "5 O Level subjects",
    price: "USD 135 / Module",
    icon: BookOpen,
    color: "from-sky-500 to-cyan-600",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(14,165,233,0.3)",
    image: programImages.aiDiploma,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

const rotateAnimation = {
  rotate: [0, 360],
  transition: { duration: 20, repeat: Infinity, ease: "linear" },
};

type ProgramForm = {
  firstName: string;
  lastName: string;
  email: string;
  graduateStatus: "graduate" | "non_graduate";
  selectedProgramIds: string[];
  document: File | null;
};

export default function Enrollment() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<ProgramForm>({
    firstName: "",
    lastName: "",
    email: "",
    graduateStatus: "graduate",
    selectedProgramIds: [],
    document: null,
  });

  const programsById = useMemo(() => {
    const m = new Map<string, (typeof programOptions)[number]>();
    programOptions.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  const openEnroll = (preselectId?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setForm((prev) => {
      const ids = new Set(prev.selectedProgramIds);
      if (preselectId) ids.add(preselectId);
      return { ...prev, selectedProgramIds: Array.from(ids) };
    });
    setOpen(true);
  };

  const toggleProgram = (id: string) => {
    setForm((prev) => {
      const s = new Set(prev.selectedProgramIds);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return { ...prev, selectedProgramIds: Array.from(s) };
    });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "Name is required.";
    if (!form.lastName.trim()) return "Surname is required.";
    if (!form.email.trim() || !form.email.includes("@"))
      return "Valid email is required.";
    if (form.selectedProgramIds.length < 1)
      return "Select at least one program.";

    if (!form.document) {
      return form.graduateStatus === "graduate"
        ? "Upload Educational Certificate."
        : "Upload Advanced Level Results or Employer’s Letter.";
    }
    return null;
  };

  const submit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setSubmitting(true);
    try {
      const selectedPrograms = form.selectedProgramIds
        .map((id) => programsById.get(id))
        .filter(Boolean);

      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("email", form.email);
      fd.append("graduateStatus", form.graduateStatus);
      fd.append("selectedProgramIds", JSON.stringify(form.selectedProgramIds));
      fd.append("selectedPrograms", JSON.stringify(selectedPrograms));
      fd.append("document", form.document!);

      const res = await fetch("/api/program-applications", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit.");

      setSuccessMsg(`Application received! Reference: ${data.referenceNumber}`);
      setForm((prev) => ({
        ...prev,
        selectedProgramIds: [],
        document: null,
      }));
    } catch (e: any) {
      setErrorMsg(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const Poster = ({ src, alt }: { src?: string; alt: string }) => {
    if (!src) {
      return (
        <div className="w-full h-full flex items-center justify-center text-slate-500">
          <ImageIcon className="w-8 h-8" />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      />
    );
  };

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
            className="text-center mb-10"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 tracking-wider uppercase"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,255,0.3)",
                  "0 0 40px rgba(0,255,255,0.5)",
                  "0 0 20px rgba(0,255,255,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
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
              Empowering Africa through Artificial Intelligence Education and
              Innovation
            </motion.p>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => openEnroll()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold tracking-wider uppercase px-8 py-6"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  boxShadow: "0 0 30px rgba(0,255,255,0.35)",
                }}
              >
                Enroll Now
              </Button>
            </div>
          </motion.div>

          <Tabs defaultValue="short" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-slate-800/50 border border-cyan-500/20 mb-8">
              <TabsTrigger
                value="short"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <motion.div whileHover={{ rotate: 15 }}>
                  <Clock className="w-4 h-4 mr-2" />
                </motion.div>
                Short Courses
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <motion.div whileHover={{ rotate: 15 }}>
                  <Award className="w-4 h-4 mr-2" />
                </motion.div>
                Certificates
              </TabsTrigger>
              <TabsTrigger
                value="diplomas"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <motion.div whileHover={{ rotate: 15 }}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                </motion.div>
                Diplomas
              </TabsTrigger>
            </TabsList>

            {/* SHORT COURSES */}
            <TabsContent value="short">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-8"
              >
                {shortCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card
                      className={`bg-slate-800/50 ${course.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${course.glowColor}` }}
                    >
                      <div className="relative h-44 w-full overflow-hidden border-b border-slate-700/40">
                        <Poster src={course.image} alt={course.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <course.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle
                          className="text-xl text-slate-100 group-hover:text-white transition-colors"
                          style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
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
                          <div
                            className={`text-2xl font-bold bg-gradient-to-r ${course.color} bg-clip-text text-transparent`}
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                          >
                            {course.price}
                          </div>
                        </motion.div>

                        <Button
                          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                          onClick={() => openEnroll(course.id)}
                        >
                          Enroll
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* CERTIFICATES */}
            <TabsContent value="certificates">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-8"
              >
                {certificates.map((cert) => (
                  <motion.div
                    key={cert.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card
                      className={`bg-slate-800/50 ${cert.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${cert.glowColor}` }}
                    >
                      <div className="relative h-44 w-full overflow-hidden border-b border-slate-700/40">
                        <Poster src={cert.image} alt={cert.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <cert.icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <CardTitle
                          className="text-xl text-slate-100 group-hover:text-white transition-colors"
                          style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                          {cert.name}
                        </CardTitle>
                        <p className="text-sm text-cyan-400/80">
                          {cert.subtitle}
                        </p>
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
                          <div
                            className={`text-2xl font-bold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                          >
                            {cert.price}
                          </div>
                        </motion.div>

                        <Button
                          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                          onClick={() => openEnroll(cert.id)}
                        >
                          Enroll
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* DIPLOMAS */}
            <TabsContent value="diplomas">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {diplomas.map((diploma) => (
                  <motion.div
                    key={diploma.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card
                      className={`bg-slate-800/50 ${diploma.borderColor} border-2 hover:border-opacity-100 transition-all duration-500 h-full group relative overflow-hidden`}
                      style={{ boxShadow: `0 0 30px ${diploma.glowColor}` }}
                    >
                      <div className="relative h-44 w-full overflow-hidden border-b border-slate-700/40">
                        <Poster src={diploma.image} alt={diploma.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <CardHeader className="pb-2 relative">
                        <motion.div
                          className={`w-20 h-20 rounded-xl bg-gradient-to-br ${diploma.color} flex items-center justify-center mb-4 shadow-lg`}
                          animate={floatAnimation}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <diploma.icon className="w-10 h-10 text-white" />
                        </motion.div>

                        <CardTitle
                          className="text-2xl text-slate-100 group-hover:text-white transition-colors"
                          style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                          {diploma.name}
                        </CardTitle>
                        <p className="text-sm text-purple-400/80">
                          {diploma.subtitle}
                        </p>
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
                          <div
                            className={`text-3xl font-bold bg-gradient-to-r ${diploma.color} bg-clip-text text-transparent`}
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                          >
                            {diploma.price}
                          </div>
                        </motion.div>

                        <Button
                          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                          onClick={() => openEnroll(diploma.id)}
                        >
                          Enroll
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
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
            <h3
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Start Your AI Journey Today
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Applications for March 2026 intake are now open.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{ scale: 1.02, borderColor: "rgba(0,255,255,0.5)" }}
              >
                <motion.div animate={floatAnimation}>
                  <FileText className="w-8 h-8 text-cyan-400 mb-3" />
                </motion.div>
                <h4 className="font-bold text-cyan-300 mb-2">Documents</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400" /> Graduate:
                    Educational Certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400" /> Non-graduate:
                    A Level Results / Employer’s Letter
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(168,85,247,0.5)",
                }}
              >
                <motion.div animate={floatAnimation}>
                  <Mail className="w-8 h-8 text-purple-400 mb-3" />
                </motion.div>
                <h4 className="font-bold text-purple-300 mb-2">Email</h4>
                <a
                  href="mailto:admin@aiinstituteafrica.com"
                  className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                >
                  admin@aiinstituteafrica.com
                </a>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(236,72,153,0.5)",
                }}
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
              className="mt-8 flex justify-center gap-3 flex-wrap"
              whileHover={{ scale: 1.02 }}
            >
              <Button
                onClick={() => openEnroll()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold tracking-wider uppercase px-10 py-6 text-lg"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  boxShadow: "0 0 30px rgba(0,255,255,0.4)",
                }}
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                </motion.div>
                Enroll Now
              </Button>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ENROLLMENT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Program Enrollment</DialogTitle>
          </DialogHeader>

          {errorMsg && (
            <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-md border border-green-300 bg-green-50 text-green-800 px-3 py-2 text-sm">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Surname *</Label>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Email *</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="block mb-2">Choose 1 or more programs *</Label>
            <div className="grid gap-2 max-h-64 overflow-auto pr-1">
              {programOptions.map((p) => (
                <label
                  key={p.id}
                  className="flex items-start gap-3 rounded-md border p-3 cursor-pointer"
                >
                  <Checkbox
                    checked={form.selectedProgramIds.includes(p.id)}
                    onCheckedChange={() => toggleProgram(p.id)}
                  />
                  <div className="flex gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.category}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Label className="block mb-2">Graduate status *</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.graduateStatus === "graduate"}
                  onChange={() =>
                    setForm({
                      ...form,
                      graduateStatus: "graduate",
                      document: null,
                    })
                  }
                />
                Graduate
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.graduateStatus === "non_graduate"}
                  onChange={() =>
                    setForm({
                      ...form,
                      graduateStatus: "non_graduate",
                      document: null,
                    })
                  }
                />
                Non-Graduate
              </label>
            </div>
          </div>

          <div className="mt-4">
            <Label>
              {form.graduateStatus === "graduate"
                ? "Upload Educational Certificate *"
                : "Upload Advanced Level Results or Employer’s Letter *"}
            </Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                setForm({ ...form, document: e.target.files?.[0] || null })
              }
            />
            <div className="text-xs text-muted-foreground mt-1">
              Accepted formats: PDF / JPG / PNG
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
