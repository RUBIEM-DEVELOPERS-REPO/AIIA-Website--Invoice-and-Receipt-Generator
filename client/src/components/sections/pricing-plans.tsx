import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useMembership } from "@/lib/membership-context";
import { useMembershipCount } from "@/hooks/use-membership-count";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free Membership",
    description: "Congradulations you have qualified for our free membership plan to get you started with the institution",
    price: { yearly: 0 },
    features: [
      "Access to public research p",
      "Newsletter subscription",
      "Community forum access",
      "Get a Member verification code",
    ],
  },
  {
    name: "Student Member",
    description:
      "Open to individuals studying at recognized and registered institutions",
    price: { yearly: 25 },
    features: [
      "Free AI Training/Certification",
      "Attachment Recommendations",
      "Access to AIIA Publications and Online ResourcesMentorship opportunities",
      "Mentorship Program",
      "Networking Opportunities",
      "Discounted access to AIIA events and workshops",
    ],
  },
  {
    name: "Full Member",
    description:
      "Open to Holders of an AI  Certification fromo a recognized institutuin or examination body. Graduates with AI-related qualifications from a recognized tertiary institution. Individuals with at least two years of proven AI experience, subject to Board approval.",
    price: { yearly: 100 },
    features: [
      "50% Discount on AIIA products/services",
      "Consultancy/training contract opportunities",
      "Access to AIIA Publications and Online Resources",
      "Mentorship Program",
      "Participation in AI collaborations",
      "Networking Opportunities",
      "Discounted access to AIIA events and workshops",
    ],
  },
  {
    name: "Fellow Member",
    description:
      "Have provided outstanding service to AI at national, regional, or international levels.",
    price: { yearly: 150 },
    features: [
      "50% Discount on AIIA products/services",
      "Consultancy/training contract opportunities",
      "AIIA employment/project references",
      "Representation of AIIA (with President's approval)",
      "Speaking opportunities at events (with President's approval)",
      "Collaboration with sister associations",
      "Access to exclusive AIIA events and networking opportunitie",
    ],
  },
  {
    name: "Institutional Member",
    description:
      "Open to registered organizations, corporations, enterprises, or companies operating within legal frameworks.",
    price: { yearly: 3000 },
    features: [
      "All staff members can enjoy the benefits of AIIA membership.",
      "30% Discount on AIIA products/services",
      "AIIA employment/project references",
      "Recognition as an AIIA partner",
      "Marketing/sales at AIIA events (with approval)",
      "Speaking opportunities at events (with President's approval)",
      "Access to exclusive AIIA events and networking opportunities",
    ],
  },
];

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<"yearly">("yearly");
  const { setSelectedPlan } = useMembership();
  const { remainingSpots, isLoading } = useMembershipCount();
  const [, setLocation] = useLocation();

  const handlePlanSelection = (plan: (typeof plans)[0]) => {
    // Only allow selection if it's the free plan and spots are available
    // or if it's a paid plan and no spots are available
    if ((plan.name === "Free Membership" && remainingSpots > 0) ||
        (plan.name !== "Free Membership" && remainingSpots === 0)) {
      setSelectedPlan({
        name: plan.name,
        billing: billingCycle,
        amount: plan.price[billingCycle].toString(),
      });
      setLocation("/payment");
    }
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Choose Your Membership Plan
          </h2>
          {!isLoading && remainingSpots > 0 && (
            <div className="text-lg text-primary mb-4">
              <AlertCircle className="inline-block mr-2" />
              Only {remainingSpots} free membership spots remaining!
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isFreePlan = plan.name === "Free Membership";
            const isActive = isLoading ? false : // Disable all while loading
              (isFreePlan && remainingSpots > 0) || 
              (!isFreePlan && remainingSpots === 0);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "relative h-full transition-colors",
                    isActive 
                      ? "hover:border-primary/50" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-muted-foreground ml-2">
                          /{billingCycle === "yearly" ? "yr" : ""}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={index === 0 ? "outline" : "default"}
                      onClick={() => handlePlanSelection(plan)}
                      disabled={!isActive}
                    >
                      {isLoading ? "Loading..." : index === 0 ? "Get Started" : "Subscribe Now"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}