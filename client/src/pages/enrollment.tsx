import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  BookOpen,
  Brain,
  Users,
  Building2,
  Sparkles,
  Calendar,
  Award,
  Layers,
  Target,
  Briefcase,
  Zap,
  Star,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  MapPin,
  X,
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { programImages } from "@/lib/programs";
import { iobzAppliedAiContent } from "@/lib/programs";

/**
 * ✅ YOUR LATEST IMAGE MAPPING
 * programImages.masterAiOrgs      -> IMG-20260115-WA0114 (Master AI programs for corporates)
 * programImages.basicAiCert       -> IMG-20260115-WA0116 (Basic AI Certification)
 * programImages.aiDiploma         -> ai_diploma (AI Diploma)
 * programImages.postgradAiDiploma -> postgrad_diploma (Postgrad AI Diploma)
 * programImages.nonGraduateAiCert -> IMG-20260115-WA0119 (Non-Graduate Certificate)
 * programImages.graduateAiCert    -> IMG-20260115-WA0063 (Graduate AI Certificate)
 * programImages.advancedAiCert    -> IMG-20260115-WA0120 (Advanced AI Certification)
 *
 * ✅ IOBZ
 * programImages.iobzLogo          -> IOBZ-Logo-Final-271x300.webp
 * programImages.iobzAppliedAi     -> IMG-20260121-WA0225.jpg
 */

// --- Email routing rules (sent to backend) ---
const DEFAULT_NOTIFY_EMAILS = ["admin@aiinstituteafrica.com"];
const IOBZ_NOTIFY_EMAILS = [
  "admin@aiinstituteafrica.com",
  "marvellous@iobz.co.zw",
  // ✅ removed: "munyika@iobz.co.zw"
];

// --- IDs (corporate) ---
const CORPORATE_IDS = ["dir", "exec", "prof", "iobz_applied"] as const;

const corporatePrograms = [
  {
    id: "dir",
    name: "Master AI for Directors",
    duration: "1.5 Days",
    target: "Directors and C-suite",
    format: "Physical training",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245,158,11,0.3)",
    image: programImages.masterAiOrgs,
  },
  {
    id: "exec",
    name: "Master AI for Executives",
    duration: "2 Days",
    target: "Executives and Management",
    format: "Physical training",
    icon: Briefcase,
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(0,255,255,0.3)",
    image: programImages.masterAiOrgs,
  },
  {
    id: "prof",
    name: "Master AI for Professionals",
    duration: "3 Days",
    target: "Professional development",
    format: "Physical and Online training",
    icon: Users,
    color: "from-purple-500 to-pink-600",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.3)",
    image: programImages.masterAiOrgs,
  },
] as const;

// ✅ Certificates = keep prices
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
    image: programImages.graduateAiCert,
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
    image: programImages.nonGraduateAiCert,
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
    image: programImages.basicAiCert,
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
    image: programImages.advancedAiCert,
  },
] as const;

// ✅ Diplomas = keep prices
const diplomas = [
  {
    id: "postgrad",
    name: "Postgrad AI Diploma Program",
    subtitle: "Specialized AI training for Bachelor’s Degree holders",
    duration: "6 Months",
    format: "Physical & Online",
    modules: "8 Modules",
    requirement: "Bachelor's Degree",
    price: "USD 130 / Module",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139,92,246,0.3)",
    image: programImages.postgradAiDiploma,
  },
  {
    id: "aidip",
    name: "AI Diploma Program",
    subtitle: "Begin Your Career in Artificial Intelligence!",
    duration: "18 Months",
    format: "Online & Physical Classes",
    modules: "8 Modules",
    requirement: "3 A Levels or Employer Letter",
    price: "USD 150 / Module",
    icon: BookOpen,
    color: "from-sky-500 to-cyan-600",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(14,165,233,0.3)",
    image: programImages.aiDiploma,
  },
] as const;

const individualProgramOptions = [
  {
    id: "gradcert",
    name: "Graduate AI Certificate Program",
    image: programImages.graduateAiCert,
  },
  {
    id: "nongrad",
    name: "Non-Graduate AI Certificate",
    image: programImages.nonGraduateAiCert,
  },
  {
    id: "basic",
    name: "Basic AI Certification",
    image: programImages.basicAiCert,
  },
  {
    id: "advanced",
    name: "Advanced AI Certification",
    image: programImages.advancedAiCert,
  },
  {
    id: "postgrad",
    name: "Postgrad AI Diploma Program",
    image: programImages.postgradAiDiploma,
  },
  { id: "aidip", name: "AI Diploma Program", image: programImages.aiDiploma },
] as const;

const corporateProgramOptions = [
  {
    id: "dir",
    name: "Master AI for Directors",
    image: programImages.masterAiOrgs,
  },
  {
    id: "exec",
    name: "Master AI for Executives",
    image: programImages.masterAiOrgs,
  },
  {
    id: "prof",
    name: "Master AI for Professionals",
    image: programImages.masterAiOrgs,
  },

  // ✅ IOBZ (special registration fields)
  {
    id: "iobz_applied",
    name: "Applied AI for Business Professionals (IOBZ)",
    image: programImages.iobzAppliedAi,
  },
] as const;

type TrainingType = "individual" | "corporate";
type GraduateStatus = "graduate" | "non_graduate";

type EnrollmentFormState = {
  trainingType: TrainingType;

  // individual
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  graduateStatus: GraduateStatus;
  individualProgramIds: string[];
  individualDocument: File | null;

  // corporate
  organizationName: string; // AIIA corporate
  contactFirstName: string; // used for AIIA corporate & IoBZ Name
  contactLastName: string; // used for AIIA corporate & IoBZ Surname
  corporatePhone: string;
  corporateEmail: string;
  corporateProgramIds: string[];
  attendeesListFile: File | null; // AIIA corporate only

  // IoBZ extra fields
  iobzPosition: string;
  iobzBankOrganisation: string;
};

export default function Enrollment() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<EnrollmentFormState>({
    trainingType: "individual",

    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    graduateStatus: "graduate",
    individualProgramIds: [],
    individualDocument: null,

    organizationName: "",
    contactFirstName: "",
    contactLastName: "",
    corporatePhone: "",
    corporateEmail: "",
    corporateProgramIds: [],
    attendeesListFile: null,

    iobzPosition: "",
    iobzBankOrganisation: "",
  });

  const isIobz =
    form.trainingType === "corporate" &&
    form.corporateProgramIds.includes("iobz_applied");

  const openEnroll = (preselectId?: string) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    const isCorporate = Boolean(
      preselectId && (CORPORATE_IDS as readonly string[]).includes(preselectId),
    );

    setForm((prev) => {
      const next = { ...prev };

      if (isCorporate) {
        next.trainingType = "corporate";
        if (preselectId) {
          // If preselecting IoBZ, enforce only IoBZ selection
          if (preselectId === "iobz_applied") {
            next.corporateProgramIds = ["iobz_applied"];
          } else {
            const s = new Set(
              next.corporateProgramIds.filter((x) => x !== "iobz_applied"),
            );
            s.add(preselectId);
            next.corporateProgramIds = Array.from(s);
          }
        }
      } else if (preselectId) {
        next.trainingType = "individual";
        const s = new Set(next.individualProgramIds);
        s.add(preselectId);
        next.individualProgramIds = Array.from(s);
      }

      return next;
    });

    setOpen(true);
  };

  const toggleIndividualProgram = (id: string) => {
    setForm((prev) => {
      const s = new Set(prev.individualProgramIds);
      s.has(id) ? s.delete(id) : s.add(id);
      return { ...prev, individualProgramIds: Array.from(s) };
    });
  };

  const toggleCorporateProgram = (id: string) => {
    setForm((prev) => {
      // Enforce exclusivity: IoBZ cannot be combined with other corporate programs
      if (id === "iobz_applied") {
        const isSelected = prev.corporateProgramIds.includes("iobz_applied");
        return {
          ...prev,
          corporateProgramIds: isSelected ? [] : ["iobz_applied"],
        };
      }

      // If selecting a non-IOBZ corporate program, ensure IoBZ is removed
      const s = new Set(
        prev.corporateProgramIds.filter((x) => x !== "iobz_applied"),
      );
      s.has(id) ? s.delete(id) : s.add(id);
      return { ...prev, corporateProgramIds: Array.from(s) };
    });
  };

  const validate = () => {
    if (form.trainingType === "individual") {
      if (!form.firstName.trim()) return "Name is required.";
      if (!form.lastName.trim()) return "Surname is required.";
      if (!form.phone.trim()) return "Phone number is required.";
      if (!form.email.trim() || !form.email.includes("@"))
        return "Valid email is required.";
      if (form.individualProgramIds.length < 1)
        return "Select at least one program.";
      if (!form.individualDocument) {
        return form.graduateStatus === "graduate"
          ? "Upload Certificate (Graduate)."
          : "Upload Employer’s Letter or A Level Certificate (Non-Graduate).";
      }
      return null;
    }

    // corporate
    if (form.corporateProgramIds.length < 1)
      return "Select at least one corporate program.";

    const isIobzSelected = form.corporateProgramIds.includes("iobz_applied");

    if (isIobzSelected) {
      if (!form.contactFirstName.trim()) return "Name is required.";
      if (!form.contactLastName.trim()) return "Surname is required.";
      if (!form.iobzPosition.trim())
        return "Position / Designation is required.";
      if (!form.iobzBankOrganisation.trim())
        return "Bank/Organisation is required.";
      if (!form.corporatePhone.trim()) return "Phone number is required.";
      if (!form.corporateEmail.trim() || !form.corporateEmail.includes("@"))
        return "Valid email is required.";
      return null;
    }

    // Non-IOBZ corporate (AIIA corporate)
    if (!form.organizationName.trim()) return "Organization name is required.";
    if (!form.contactFirstName.trim())
      return "Contact person name is required.";
    if (!form.contactLastName.trim())
      return "Contact person surname is required.";
    if (!form.corporatePhone.trim()) return "Phone number is required.";
    if (!form.corporateEmail.trim() || !form.corporateEmail.includes("@"))
      return "Valid email is required.";
    if (!form.attendeesListFile) return "Upload the list of attendees.";
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
      const fd = new FormData();
      fd.append("trainingType", form.trainingType);

      // ✅ Decide recipients (backend should use this to email admins)
      const notifyEmails =
        form.trainingType === "corporate" &&
        form.corporateProgramIds.includes("iobz_applied")
          ? IOBZ_NOTIFY_EMAILS
          : DEFAULT_NOTIFY_EMAILS;

      fd.append("notifyEmails", JSON.stringify(notifyEmails));

      if (form.trainingType === "individual") {
        fd.append("firstName", form.firstName);
        fd.append("lastName", form.lastName);
        fd.append("phone", form.phone);
        fd.append("email", form.email);
        fd.append("graduateStatus", form.graduateStatus);

        const selectedPrograms = form.individualProgramIds.map((id) => {
          const prog = individualProgramOptions.find((p) => p.id === id);
          return {
            id,
            name: prog?.name || id,
            category: "Individual Training",
          };
        });
        fd.append(
          "selectedProgramIds",
          JSON.stringify(form.individualProgramIds),
        );
        fd.append("selectedPrograms", JSON.stringify(selectedPrograms));
        fd.append("document", form.individualDocument!);
      } else {
        fd.append("phone", form.corporatePhone);
        fd.append("email", form.corporateEmail);

        const selectedPrograms = form.corporateProgramIds.map((id) => {
          const prog = corporateProgramOptions.find((p) => p.id === id);
          return { id, name: prog?.name || id, category: "Corporate Training" };
        });

        // helpful flag for backend logic
        fd.append(
          "partner",
          form.corporateProgramIds.includes("iobz_applied") ? "iobz" : "aiia",
        );

        fd.append(
          "selectedProgramIds",
          JSON.stringify(form.corporateProgramIds),
        );
        fd.append("selectedPrograms", JSON.stringify(selectedPrograms));

        if (form.corporateProgramIds.includes("iobz_applied")) {
          // ✅ IoBZ payload fields requested
          fd.append("firstName", form.contactFirstName);
          fd.append("lastName", form.contactLastName);
          fd.append("position", form.iobzPosition);
          fd.append("bankOrganisation", form.iobzBankOrganisation);
        } else {
          // ✅ AIIA corporate payload fields
          fd.append("organizationName", form.organizationName);
          fd.append("contactFirstName", form.contactFirstName);
          fd.append("contactLastName", form.contactLastName);
          fd.append("attendeesList", form.attendeesListFile!);
        }
      }

      const res = await fetch("/api/program-applications", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit.");

      setSuccessMsg(`Application received! Reference: ${data.referenceNumber}`);

      setForm({
        trainingType: "individual",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        graduateStatus: "graduate",
        individualProgramIds: [],
        individualDocument: null,

        organizationName: "",
        contactFirstName: "",
        contactLastName: "",
        corporatePhone: "",
        corporateEmail: "",
        corporateProgramIds: [],
        attendeesListFile: null,

        iobzPosition: "",
        iobzBankOrganisation: "",
      });
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
        className="w-full h-full object-contain bg-white opacity-95 group-hover:opacity-100 transition-opacity"
      />
    );
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h1
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              AI Course Catalogue
            </h1>

            <p className="text-xl text-cyan-200/70 max-w-3xl mx-auto">
              Empowering Africa through Artificial Intelligence Education and
              Innovation
            </p>

            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <Button
                onClick={() => openEnroll()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold tracking-wider uppercase px-8 py-6"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Enroll Now
              </Button>
              <a href="https://cognify.aiinstituteafrica.com" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 font-bold tracking-wider uppercase px-8 py-6"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  E-Learning Platform
                </Button>
              </a>
            </div>
          </div>

          <Tabs defaultValue="corporate" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-slate-800/50 border border-cyan-500/20 mb-8">
              <TabsTrigger
                value="corporate"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Corporate Courses
              </TabsTrigger>

              <TabsTrigger
                value="certificates"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
              >
                <Award className="w-4 h-4 mr-2" />
                Certificates
              </TabsTrigger>

              <TabsTrigger
                value="diplomas"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Diplomas
              </TabsTrigger>
            </TabsList>

            {/* CORPORATE COURSES (NO PRICES) */}
            <TabsContent value="corporate">
              <div className="grid md:grid-cols-3 gap-8">
                {corporatePrograms.map((course) => (
                  <Card
                    key={course.id}
                    className={`bg-slate-800/50 ${course.borderColor} border-2 h-full group overflow-hidden flex flex-col`}
                    style={{ boxShadow: `0 0 30px ${course.glowColor}` }}
                  >
                    <div className="relative h-52 w-full overflow-hidden border-b border-slate-700/40">
                      <Poster src={course.image} alt={course.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <CardHeader className="pb-2">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <course.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-slate-100">
                        {course.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-cyan-400" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-400" />
                          <span>{course.target}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-blue-400" />
                          <span>{course.format}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <Button
                          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                          onClick={() => openEnroll(course.id)}
                        >
                          Enroll
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* ✅ IOBZ SECTION (after AIIA programs) */}
              <div className="mt-12">
                <Card className="bg-slate-800/40 border border-cyan-500/20 overflow-hidden">
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Poster side */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-5">
                      <div className="rounded-xl border border-slate-700/50 bg-white/95 shadow-sm overflow-hidden">
                        {/* Fixed aspect ratio so image NEVER stretches */}
                        <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
                          <img
                            src={programImages.iobzAppliedAi}
                            alt="Applied AI for Business Professionals"
                            className="absolute inset-0 w-full h-full object-contain p-2"
                          />
                        </div>
                      </div>

                      {/* Small caption / badge row */}
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200/90">
                        <span className="px-3 py-1 rounded-full bg-slate-700/40 border border-slate-600/40">
                          Partner Program
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-700/40 border border-slate-600/40">
                          Corporate Application
                        </span>
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="lg:col-span-3 p-6 md:p-8">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="shrink-0 rounded-md bg-white p-2 border border-slate-200">
                          <img
                            src={programImages.iobzLogo}
                            alt="Institute of Bankers of Zimbabwe"
                            className="h-10 w-auto object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm text-cyan-300/80">
                            Partner Program
                          </div>
                          <h3 className="text-2xl font-bold text-slate-100 leading-tight">
                            {iobzAppliedAiContent.title}
                          </h3>
                          <div className="text-sm text-slate-300 mt-1">
                            {iobzAppliedAiContent.partner}
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-slate-300 leading-relaxed mb-6">
                        {iobzAppliedAiContent.summary}
                      </p>

                      {/* Quick facts */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-pink-400" />
                          <span>
                            <span className="font-semibold text-slate-100">
                              Audience:
                            </span>{" "}
                            {iobzAppliedAiContent.audience}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span>
                            <span className="font-semibold text-slate-100">
                              Duration:
                            </span>{" "}
                            2 Days
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span>
                            <span className="font-semibold text-slate-100">
                              Venue:
                            </span>{" "}
                            {iobzAppliedAiContent.venue}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-400" />
                          <span>
                            <span className="font-semibold text-slate-100">
                              Award:
                            </span>{" "}
                            {iobzAppliedAiContent.award}
                          </span>
                        </div>
                      </div>

                      {/* Outcomes */}
                      <div className="mb-6">
                        <h4 className="text-slate-100 font-semibold mb-2">
                          Key outcomes
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
                          {iobzAppliedAiContent.outcomes
                            .slice(0, 4)
                            .map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Modules */}
                      <div className="mb-7">
                        <h4 className="text-slate-100 font-semibold mb-2">
                          Programme modules (high level)
                        </h4>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                          {iobzAppliedAiContent.modules.map((m) => (
                            <span
                              key={m}
                              className="px-3 py-1 rounded-full bg-slate-700/40 border border-slate-600/40"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-cyan-500 hover:bg-cyan-500/90 text-white"
                          onClick={() => openEnroll("iobz_applied")}
                        >
                          Enroll / Apply (IoBZ)
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* CERTIFICATES (PRICES KEPT) */}
            <TabsContent value="certificates">
              <div className="grid md:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                  <Card
                    key={cert.id}
                    className={`bg-slate-800/50 ${cert.borderColor} border-2 h-full group overflow-hidden flex flex-col`}
                    style={{ boxShadow: `0 0 30px ${cert.glowColor}` }}
                  >
                    <div className="relative h-52 w-full overflow-hidden border-b border-slate-700/40">
                      <Poster src={cert.image} alt={cert.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <CardHeader className="pb-2">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <cert.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-slate-100">
                        {cert.name}
                      </CardTitle>
                      <p className="text-sm text-cyan-400/80">
                        {cert.subtitle}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-cyan-400" />
                          <span>{cert.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-purple-400" />
                          <span>{cert.format}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-blue-400" />
                          <span>{cert.modules}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span>{cert.requirement}</span>
                        </div>
                      </div>

                      <div
                        className="mt-4 pt-4 border-t border-slate-700/50"
                        style={{ marginTop: "auto" }}
                      >
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}
                        >
                          {cert.price}
                        </div>
                        <div className="mt-4">
                          <Button
                            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                            onClick={() => openEnroll(cert.id)}
                          >
                            Enroll
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* DIPLOMAS (PRICES KEPT) */}
            <TabsContent value="diplomas">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {diplomas.map((diploma) => (
                  <Card
                    key={diploma.id}
                    className={`bg-slate-800/50 ${diploma.borderColor} border-2 h-full group overflow-hidden flex flex-col`}
                    style={{ boxShadow: `0 0 30px ${diploma.glowColor}` }}
                  >
                    <div className="relative h-52 w-full overflow-hidden border-b border-slate-700/40">
                      <Poster src={diploma.image} alt={diploma.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <CardHeader className="pb-2">
                      <div
                        className={`w-20 h-20 rounded-xl bg-gradient-to-br ${diploma.color} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <diploma.icon className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-slate-100">
                        {diploma.name}
                      </CardTitle>
                      <p className="text-sm text-purple-400/80">
                        {diploma.subtitle}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-cyan-400" />
                          <span>{diploma.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-purple-400" />
                          <span>{diploma.format}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-blue-400" />
                          <span>{diploma.modules}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span>{diploma.requirement}</span>
                        </div>
                      </div>

                      <div
                        className="mt-4 pt-4 border-t border-slate-700/50"
                        style={{ marginTop: "auto" }}
                      >
                        <div
                          className={`text-3xl font-bold bg-gradient-to-r ${diploma.color} bg-clip-text text-transparent`}
                        >
                          {diploma.price}
                        </div>

                        <div className="mt-4">
                          <Button
                            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-500/30"
                            onClick={() => openEnroll(diploma.id)}
                          >
                            Enroll
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <motion.div className="mt-16 text-center" animate={pulseAnimation}>
            <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          </motion.div>

          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ENROLLMENT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <DialogHeader>
            <DialogTitle className="text-xl">Training Application</DialogTitle>
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

          {/* Training Type */}
          <div className="mt-2">
            <Label className="block mb-2 font-semibold">
              Choose Individual AI Training or Corporate AI Training *
            </Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.trainingType === "individual"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      trainingType: "individual",
                    }))
                  }
                />
                Individual AI Training
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.trainingType === "corporate"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      trainingType: "corporate",
                    }))
                  }
                />
                Corporate AI Training
              </label>
            </div>
          </div>

          {/* INDIVIDUAL */}
          {form.trainingType === "individual" && (
            <div className="space-y-5 mt-4">
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
                <div>
                  <Label>Phone No. *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block font-semibold">
                  Choose Program(s) *
                </Label>
                <div className="grid gap-2">
                  {individualProgramOptions.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/40 transition-colors"
                    >
                      <Checkbox
                        checked={form.individualProgramIds.includes(p.id)}
                        onCheckedChange={() => toggleIndividualProgram(p.id)}
                      />
                      <div className="flex gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-24 h-16 object-contain bg-white border rounded"
                        />
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-2 font-semibold">
                  Choose Graduate or Non-Graduate *
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.graduateStatus === "graduate"}
                      onChange={() =>
                        setForm({
                          ...form,
                          graduateStatus: "graduate",
                          individualDocument: null,
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
                          individualDocument: null,
                        })
                      }
                    />
                    Non-Graduate
                  </label>
                </div>
              </div>

              <div>
                <Label className="font-semibold">
                  {form.graduateStatus === "graduate"
                    ? "Upload Certificate *"
                    : "Upload Employer’s letter or A Level Certificate *"}
                </Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      individualDocument: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* CORPORATE */}
          {form.trainingType === "corporate" && (
            <div className="space-y-5 mt-4">
              {!isIobz ? (
                // ✅ AIIA corporate fields
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Organization’s Name *</Label>
                    <Input
                      value={form.organizationName}
                      onChange={(e) =>
                        setForm({ ...form, organizationName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Contact Person’s Name *</Label>
                    <Input
                      value={form.contactFirstName}
                      onChange={(e) =>
                        setForm({ ...form, contactFirstName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Surname *</Label>
                    <Input
                      value={form.contactLastName}
                      onChange={(e) =>
                        setForm({ ...form, contactLastName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Phone No. *</Label>
                    <Input
                      value={form.corporatePhone}
                      onChange={(e) =>
                        setForm({ ...form, corporatePhone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      value={form.corporateEmail}
                      onChange={(e) =>
                        setForm({ ...form, corporateEmail: e.target.value })
                      }
                    />
                  </div>

                  {/* ✅ Removed Number of Attendees (no longer shown/required) */}
                </div>
              ) : (
                // ✅ IoBZ fields requested
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={form.contactFirstName}
                      onChange={(e) =>
                        setForm({ ...form, contactFirstName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Surname *</Label>
                    <Input
                      value={form.contactLastName}
                      onChange={(e) =>
                        setForm({ ...form, contactLastName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Position / Designation *</Label>
                    <Input
                      value={form.iobzPosition}
                      onChange={(e) =>
                        setForm({ ...form, iobzPosition: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Bank/Organisation *</Label>
                    <Input
                      value={form.iobzBankOrganisation}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          iobzBankOrganisation: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Phone No. *</Label>
                    <Input
                      value={form.corporatePhone}
                      onChange={(e) =>
                        setForm({ ...form, corporatePhone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      value={form.corporateEmail}
                      onChange={(e) =>
                        setForm({ ...form, corporateEmail: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-2 block font-semibold">
                  Choose Corporate Program(s) *
                </Label>
                <div className="grid gap-2">
                  {(isIobz
                    ? corporateProgramOptions.filter(
                        (p) => p.id === "iobz_applied",
                      )
                    : corporateProgramOptions
                  ).map((p) => (
                    <label
                      key={p.id}
                      className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/40 transition-colors"
                    >
                      <Checkbox
                        checked={form.corporateProgramIds.includes(p.id)}
                        disabled={isIobz} // ✅ if IoBZ chosen, only IoBZ program shown and fixed
                        onCheckedChange={() =>
                          !isIobz && toggleCorporateProgram(p.id)
                        }
                      />
                      <div className="flex gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-24 h-16 object-contain bg-white border rounded"
                        />
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ✅ Only non-IOBZ corporate uploads attendee list */}
              {!isIobz && (
                <div>
                  <Label className="font-semibold">
                    Upload the list of attendees *
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.txt"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        attendeesListFile: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
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
