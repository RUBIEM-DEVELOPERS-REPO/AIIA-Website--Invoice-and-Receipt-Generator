import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, GraduationCap, Clock, BookOpen, Laptop, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EnrollmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const courseOptions = [
  {
    id: "3_day",
    name: "3-Day Intensive Course",
    description: "Quick introduction to AI fundamentals",
    icon: Clock,
    duration: "3 Days",
  },
  {
    id: "6_month",
    name: "6-Month Professional Course",
    description: "Comprehensive AI training program",
    icon: BookOpen,
    duration: "6 Months",
  },
  {
    id: "12_month",
    name: "12-Month Advanced Diploma",
    description: "Full professional certification",
    icon: GraduationCap,
    duration: "12 Months",
  },
];

export function EnrollmentPopup({ isOpen, onClose }: EnrollmentPopupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: { email: string; phone: string; courseInterest: string }) => {
      return apiRequest("POST", "/api/student-leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your interest!",
        description: "We will contact you soon about the March 2026 intake.",
      });
      setEmail("");
      setPhone("");
      setSelectedCourse("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !selectedCourse) {
      toast({
        title: "Please fill all fields",
        description: "Email, phone number, and course selection are required.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({ email, phone, courseInterest: selectedCourse });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(0, 200, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(100, 0, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30"
            style={{
              boxShadow: "0 0 40px rgba(0, 255, 255, 0.15), 0 0 80px rgba(0, 200, 255, 0.1)",
              fontFamily: "'Orbitron', 'Rajdhani', 'Share Tech Mono', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl pointer-events-none" />

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-slate-800/80 hover:bg-cyan-500/20 rounded-full border border-cyan-500/30 text-cyan-400 hover:text-cyan-300"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="p-6 relative">
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-3 tracking-wider uppercase"
                  animate={{ boxShadow: ["0 0 20px rgba(0,255,255,0.3)", "0 0 40px rgba(0,255,255,0.5)", "0 0 20px rgba(0,255,255,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <Zap className="w-4 h-4" />
                  March 2026 Intake
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Ready to Join the Future?
                </h2>
                <p className="text-cyan-200/70 text-sm tracking-wide">
                  Select your program and we'll contact you with details
                </p>
              </div>

              <motion.div
                className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg p-4 mb-6 border border-purple-500/30"
                animate={{ borderColor: ["rgba(168,85,247,0.3)", "rgba(59,130,246,0.5)", "rgba(168,85,247,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <Laptop className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <span className="font-bold text-purple-300 tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>E-Training Platform Coming Soon!</span>
                </div>
                <p className="text-sm text-purple-200/70">
                  Free introductory courses will be available online. Stay tuned!
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-sm font-bold text-cyan-300 mb-2 block tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Select Course Duration
                  </Label>
                  <RadioGroup value={selectedCourse} onValueChange={setSelectedCourse} className="space-y-2">
                    {courseOptions.map((course) => (
                      <motion.div
                        key={course.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCourse === course.id
                            ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            : "border-slate-600/50 hover:border-cyan-500/50 bg-slate-800/50"
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value={course.id} id={course.id} className="border-cyan-500 text-cyan-400" />
                        <course.icon className={`w-5 h-5 ${selectedCourse === course.id ? "text-cyan-400" : "text-slate-400"}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200 text-sm tracking-wide">{course.name}</p>
                          <p className="text-xs text-slate-400">{course.description}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          selectedCourse === course.id
                            ? "text-cyan-300 bg-cyan-500/20 border border-cyan-500/50"
                            : "text-slate-400 bg-slate-700/50"
                        }`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {course.duration}
                        </span>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-bold text-cyan-300 tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-bold text-cyan-300 tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Phone Number
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+263 7XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wider uppercase"
                    style={{ fontFamily: "'Orbitron', sans-serif", boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      "Transmitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Express Interest
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 mb-2">
                  <span className="font-bold text-cyan-400">To Apply:</span> A Level, O Level, or University Degree (if any)
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Mail className="w-3 h-3 text-cyan-500" />
                  <span>Send applications to:</span>
                  <a href="mailto:admin@aiinstituteafrica.com" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline">
                    admin@aiinstituteafrica.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useEnrollmentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("enrollmentPopupSeen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("enrollmentPopupSeen", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return { isOpen, openPopup, closePopup };
}
