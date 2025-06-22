import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import PricingPlans from "@/components/sections/pricing-plans";

const membershipFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  role: z.string().min(2, "Role must be at least 2 characters"),
  interests: z
    .string()
    .min(10, "Please describe your interests in more detail"),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

export default function Membership() {
  const { toast } = useToast();
  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: MembershipFormData) => {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit application");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "We'll review your application and get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MembershipFormData) => {
    mutation.mutate(data);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa)`,
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container px-8">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our Community
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Become a member of Africa's leading AI research community and help
            shape the future of artificial intelligence on the continent.
          </motion.p>
        </div>
      </section>

      {/* Add Pricing Plans section before the membership form */}
      <section className="relative px-24">
        <PricingPlans />
      </section>

      {/* Membership Form */}
    </div>
  );
}
