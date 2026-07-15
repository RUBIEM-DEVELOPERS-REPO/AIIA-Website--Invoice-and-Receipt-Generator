import { Router } from "express";
import { db } from "@db";
import { users, payments } from "@db/schema";
import { ZodError } from "zod";
import { initiatePayment } from "../services/paynow";
import {
  sendRegistrationEmail,
  generateRegistrationEmailContent,
} from "../services/email";

const router = Router();

router.post("/api/payments", async (req, res) => {
  try {
    console.log("Starting payment/registration process", {
      email: req.body.email,
      planName: req.body.planName,
      membershipType: req.body.planName,
      memberKey: req.body.memberKey,
    });

    const membershipType = req.body.planName;
    const planName = membershipType === "Free Membership" ? "free" : "paid";

    // Import the password utility
    const { hashPassword } = await import("../utils/password");

    // Hash the password before storing it
    const hashedPassword = await hashPassword(req.body.password);

    const [user] = await db
      .insert(users)
      .values({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.fullName,
        organization: req.body.organization || null,
        role: "member",
        level: req.body.level || "user", // Add level field with default
        membershipType: membershipType,
        membershipStatus: "Active",
        membershipStartDate: new Date(),
        membershipEndDate:
          req.body.billingCycle === "yearly"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        country: req.body.country,
        interests: [],
        membership_key: req.body.memberKey,
      })
      .returning();

    console.log("User created successfully:", {
      userId: user.id,
      membershipType: user.membershipType,
      membershipKey: user.membership_key,
    });

    // Send registration confirmation email with error handling
    try {
      const emailContent = generateRegistrationEmailContent(
        user.name || '',
        user.membershipType,
        user.membership_key || ''
      );

      const emailSent = await sendRegistrationEmail({
        to: user.email,
        subject: "Welcome to AI Institute Africa - Registration Confirmed",
        html: emailContent.html,
        text: emailContent.text,
      });

      if (!emailSent) {
        console.warn(`Failed to send welcome email to ${user.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Continue with registration process despite email failure
    }

    const [payment] = await db
      .insert(payments)
      .values({
        userId: user.id, // Using the typescript property name
        amount: req.body.amount || "0",
        currency: "USD",
        status: "Completed",
        paymentMethod: req.body.paymentMethod || "free", // Using camelCase to match TS schema
        billingAddress: `${req.body.address || ''}, ${req.body.city || ''}, ${req.body.country || ''}`,
      })
      .returning();

    console.log("Payment record created:", {
      paymentId: payment.id,
      amount: payment.amount,
    });

    if (req.body.amount === "0") {
      res.json({
        success: true,
        data: {
          user,
          payment,
          memberKey: user.membership_key,
        },
      });
    } else {
      const paymentResponse = await initiatePayment(payment);
      res.json({
        success: true,
        data: {
          user,
          payment,
          pollUrl: paymentResponse.pollUrl,
          paymentRef: paymentResponse.paymentRef,
          memberKey: user.membership_key,
        },
      });
    }
  } catch (error) {
    console.error("Payment/Registration Error:", error);
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Invalid form data", errors: error.errors });
    } else {
      res
        .status(500)
        .json({ message: "Failed to process registration/payment" });
    }
  }
});

export default router;
