import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, GraduationCap, Clock, BookOpen, Laptop, Send } from "lucide-react";
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-gray-100 hover:bg-gray-200 rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="w-4 h-4" />
                  March 2026 Intake
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Interested in Enrolling?
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose your preferred course and we'll contact you with details
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Laptop className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">E-Training Platform Coming Soon!</span>
                </div>
                <p className="text-sm text-gray-600">
                  Free introductory courses will be available online. Stay tuned!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Course Duration
                  </Label>
                  <RadioGroup value={selectedCourse} onValueChange={setSelectedCourse} className="space-y-2">
                    {courseOptions.map((course) => (
                      <div
                        key={course.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCourse === course.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <RadioGroupItem value={course.id} id={course.id} />
                        <course.icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.description}</p>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {course.duration}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+263 7XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Express Interest
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold">To Apply:</span> A Level, O Level, or University Degree (if any)
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span>Send applications to:</span>
                  <a href="mailto:admin@aiinstituteafrica.com" className="text-primary font-medium hover:underline">
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
