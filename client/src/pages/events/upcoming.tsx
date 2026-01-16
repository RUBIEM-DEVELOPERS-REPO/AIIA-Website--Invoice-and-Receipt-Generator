import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/lib/logos/preloader.png";

// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { summitImages } from "@/lib/event_images";

/**
 * SUMMIT IMAGES MAPPING (from your provided files)
 * summitImages.zim2        -> IMG-20260115-WA0121.jpg
 * summitImages.techForum   -> IMG-20260111-WA0030.jpg
 * summitImages.aiEducation -> IMG-20260111-WA0010.jpg
 */
const upcomingEvents = [
  {
    id: "zim2",
    title: "Zimbabwe 2.0 – AI for National Transformation 2026",
    description:
      "Intelligence as National Infrastructure: Designing Zimbabwe’s AI-Driven Future for Global Competitiveness.",
    date: "April 2026",
    location: "Nyanga",
    time: "TBA",
    status: "Open",
    image: summitImages.zim2,
  },
  {
    id: "techforum",
    title: "AI Tech Forum Zimbabwe 2026",
    description: "Mastering AI Systems: Building Zimbabwe’s Intelligence Edge.",
    date: "April 2026",
    location: "Nyanga",
    time: "TBA",
    status: "Open",
    image: summitImages.techForum,
  },
  {
    id: "aiedu",
    title: "AI Education Africa 2026",
    description:
      "Empowering Learners and Educators — Transforming Education Through AI.",
    date: "August 2026",
    location: "Nyanga",
    time: "TBA",
    status: "Open",
    image: summitImages.aiEducation,
  },
] as const;

type SummitFormState = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  roleTitle: string;
  notes: string;
  selectedSummitIds: string[];
  agreeTerms: boolean;
};

export default function UpcomingEvents() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<SummitFormState>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    organization: "",
    roleTitle: "",
    notes: "",
    selectedSummitIds: [],
    agreeTerms: false,
  });

  const eventsById = useMemo(() => {
    const m = new Map<string, (typeof upcomingEvents)[number]>();
    upcomingEvents.forEach((e) => m.set(e.id, e));
    return m;
  }, []);

  const openRegister = (preselectId?: string) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    setForm((prev) => {
      const current = new Set(prev.selectedSummitIds);
      if (preselectId) current.add(preselectId);
      return { ...prev, selectedSummitIds: Array.from(current) };
    });

    setOpen(true);
  };

  const toggleSummit = (id: string) => {
    setForm((prev) => {
      const s = new Set(prev.selectedSummitIds);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return { ...prev, selectedSummitIds: Array.from(s) };
    });
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim() || !form.email.includes("@"))
      return "Valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.country.trim()) return "Country is required.";
    if (form.selectedSummitIds.length < 1) return "Select at least one summit.";
    if (!form.agreeTerms)
      return "You must agree to the Terms & Privacy Policy.";
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
      const payload = {
        ...form,
        selectedSummits: form.selectedSummitIds.map((id) => eventsById.get(id)),
      };

      const res = await fetch("/api/summit-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit.");

      setSuccessMsg(`Application received! Reference: ${data.referenceNumber}`);
      setForm((prev) => ({
        ...prev,
        notes: "",
        selectedSummitIds: [],
        agreeTerms: false,
      }));
    } catch (e: any) {
      setErrorMsg(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <motion.section
        className="py-24 px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <div className="flex justify-center mb-4">
              <img
                src={logoImage}
                alt="AiiA Logo"
                className="h-8 transition-transform transform hover:scale-105"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Join us at our upcoming AI summits, forums, and conferences across
              Africa.
            </p>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => openRegister()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Register for Events
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="h-full"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  <div className="relative h-72">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-contain bg-white"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge
                      className="absolute top-4 right-4 bg-green-500/90 text-white"
                      variant="secondary"
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => openRegister(event.id)}
                      >
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're planning exciting events for the future. Stay tuned for
                  announcements!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* SUMMIT REGISTRATION MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-xl">Summit Registration</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
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
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="roleTitle">Role/Title</Label>
                <Input
                  id="roleTitle"
                  value={form.roleTitle}
                  onChange={(e) =>
                    setForm({ ...form, roleTitle: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Select 1 or more summits *</Label>
              <div className="grid gap-2">
                {upcomingEvents.map((ev) => (
                  <label
                    key={ev.id}
                    className="flex items-start gap-3 rounded-md border p-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={form.selectedSummitIds.includes(ev.id)}
                      onCheckedChange={() => toggleSummit(ev.id)}
                    />
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {ev.date} • {ev.location}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <label className="flex items-start gap-3">
              <Checkbox
                checked={form.agreeTerms}
                onCheckedChange={(v) =>
                  setForm({ ...form, agreeTerms: Boolean(v) })
                }
              />
              <span className="text-sm">
                I agree to the Terms & Privacy Policy *
              </span>
            </label>
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
