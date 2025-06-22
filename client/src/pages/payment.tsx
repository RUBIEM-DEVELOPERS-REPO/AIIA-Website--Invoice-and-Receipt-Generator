import React, { useState } from "react";
import { useLocation } from "wouter";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMembership } from "@/lib/membership-context";
import { useMembershipCount } from "@/hooks/use-membership-count";
import { generateMemberKey } from "@/lib/utils/keyGenerator";

// Luhn Algorithm for credit card validation
const validateCreditCard = (cardNumber: string): boolean => {
  // Remove any spaces or hyphens
  const number = cardNumber.replace(/[\s-]/g, "");

  // Check if the number contains only digits
  if (!/^\d+$/.test(number)) return false;

  let sum = 0;
  let isEven = false;

  // Loop through values starting from the rightmost digit
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Define membership types
type MembershipType =
  | "Student Member"
  | "Full Member"
  | "Institutional Member"
  | "Free Membership";

// Common fields for all memberships
const baseFields = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  address: z.string().min(10, "Please enter your complete address"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
} as const;

// Individual membership fields
const individualFields = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
} as const;

// Free membership adds membership type selection
const freeMembershipFields = {
  ...individualFields,
  membershipType: z.string().min(2, "Please select a membership type"),
};

// Institutional membership fields
const institutionalFields = {
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyNumber: z.string().min(2, "Company number is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
} as const;

// Create schemas for different membership types
const freeMembershipSchema = z
  .object({ ...baseFields, ...freeMembershipFields })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const paidIndividualMembershipSchema = z
  .object({
    ...baseFields,
    ...individualFields,
    paymentMethod: z.string().min(1, "Please select a payment method"),
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, "Card number must be 16 digits")
      .refine((val) => validateCreditCard(val), {
        message: "Invalid credit card number",
      }),
    expiryDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
    cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
    phoneNumber: z.string().optional(),
    provider: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const institutionalMembershipSchema = z
  .object({
    ...baseFields,
    ...institutionalFields,
    paymentMethod: z.string().min(1, "Please select a payment method"),
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, "Card number must be 16 digits")
      .refine((val) => validateCreditCard(val), {
        message: "Invalid credit card number",
      }),
    expiryDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
    cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
    phoneNumber: z.string().optional(),
    provider: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FreeMembershipFormData = z.infer<typeof freeMembershipSchema>;
type PaidIndividualMembershipFormData = z.infer<
  typeof paidIndividualMembershipSchema
>;
type InstitutionalMembershipFormData = z.infer<
  typeof institutionalMembershipSchema
>;

// Update the union type to be more specific
type MembershipFormData =
  | (FreeMembershipFormData & { type: "free" })
  | (PaidIndividualMembershipFormData & { type: "paid" })
  | (InstitutionalMembershipFormData & { type: "institutional" });

export default function Payment() {
  const [, setLocation] = useLocation();
  const { selectedPlan } = useMembership();
  const { remainingSpots, isLoading } = useMembershipCount();
  const { toast } = useToast();

  const isInstitutional = selectedPlan?.name === "Institutional Member";
  const isFreeplan = selectedPlan?.name === "Free Membership";

  // If it's a free plan and no spots are left, redirect to membership page
  React.useEffect(() => {
    if (isFreeplan && remainingSpots <= 0) {
      toast({
        title: "No Free Spots Available",
        description:
          "All free membership spots have been claimed. Please select a different plan.",
        variant: "destructive",
      });
      setLocation("/membership");
    }
  }, [isFreeplan, remainingSpots, setLocation, toast]);

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(
      isInstitutional
        ? institutionalMembershipSchema
        : isFreeplan
          ? freeMembershipSchema
          : paidIndividualMembershipSchema,
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      country: "",
      ...(isFreeplan && {
        membershipType: "Free Membership",
      }),
      ...(isInstitutional
        ? {
            companyName: "",
            companyNumber: "",
            contactPerson: "",
          }
        : {
            firstName: "",
            surname: "",
          }),
      ...((!isFreeplan || isInstitutional) && {
        paymentMethod: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        phoneNumber: "",
        provider: "",
      }),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MembershipFormData) => {
      const fullName = isInstitutional
        ? (data as InstitutionalMembershipFormData).companyName
        : `${(data as any).firstName} ${(data as any).surname}`;
      
      // For free membership, use the selected membership type
      const membershipType = isFreeplan 
        ? (data as any).membershipType 
        : selectedPlan?.name;
        
      const memberKey = generateMemberKey(membershipType);

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fullName,
          planName: membershipType,
          billingCycle: selectedPlan?.billing,
          amount: selectedPlan?.amount,
          memberKey, // Add the generated key to the payload
        }),
      });
      if (!response.ok) throw new Error("Failed to process registration");

      await fetch("/api/membership/increment", {
        method: "POST",
      });

      return response.json();
    },
    onSuccess: (response) => {
      const membershipType = isFreeplan 
        ? form.getValues("membershipType") 
        : selectedPlan?.name;
        
      toast({
        title: isFreeplan ? "Registration successful" : "Payment successful",
        description: `Welcome to AI Institute Africa! Your ${membershipType} is now active. Your membership key has been sent to your email`,
      });
      form.reset();
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${
          isFreeplan ? "register" : "process payment"
        }. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MembershipFormData) => {
    mutation.mutate(data);
  };

  const paymentMethod = form.watch("paymentMethod");

  return (
    <div className="container py-16">
      {!selectedPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>
              Please select a membership plan first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/membership")}>
              View Membership Plans
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isFreeplan ? "Complete Registration" : "Complete Your Payment"}
            </CardTitle>
            <CardDescription>
              {isFreeplan
                ? `You are registering for ${selectedPlan?.name} (${remainingSpots} spots remaining)`
                : `You are subscribing to ${selectedPlan?.name} (${selectedPlan?.billing}) for $${selectedPlan?.amount}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {isInstitutional ? (
                    // Institutional membership fields
                    <>
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    // Individual membership fields
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Membership Type Selector for Free Plan */}
                  {isFreeplan && (
                    <FormField
                      control={form.control}
                      name="membershipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membership Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select membership type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Student Member">Student Member</SelectItem>
                              <SelectItem value="Full Member">Full Member</SelectItem>
                              <SelectItem value="Free Membership">Free Membership</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment fields for paid memberships */}
                  {!isFreeplan && (
                    <>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {paymentMethod === "credit_card" && (
                        <>
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234567890123456"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === "mobile_payment" && (
                        <>
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+1234567890"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="provider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Provider</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select mobile provider" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                                    <SelectItem value="airtel">Airtel Money</SelectItem>
                                    <SelectItem value="orange">Orange Money</SelectItem>
                                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Processing..."
                    : isFreeplan
                      ? "Complete Registration"
                      : `Pay $${selectedPlan?.amount}`}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}