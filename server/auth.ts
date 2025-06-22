import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request } from "express";
import { db } from "@db";
import { users, admins } from "@db/schema";
import { eq } from "drizzle-orm";
import { comparePasswords } from "./utils/password";

async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).limit(1);
}

async function getAdminByUsername(username: string) {
  return db.select().from(admins).where(eq(admins.username, username)).limit(1);
}

interface AuthError extends Error {
  message: string;
}

import { randomBytes } from 'crypto';
import { generatePasswordResetEmailContent, sendPasswordResetEmail } from './services/email';
import { hashPassword } from './utils/password';

export function setupAuth(app: Express) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email: string, password: string, done: (error: AuthError | null, user?: any, info?: { message: string }) => void) => {
        try {
          const [user] = await getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          return done(null, user);
        } catch (error) {
          return done(error as AuthError);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          level: users.level,
          membershipType: users.membershipType,
          membershipStatus: users.membershipStatus,
          membership_key: users.membership_key
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("User deserialization error:", error);
      done(null, false);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Login endpoint
  app.post("/api/auth/login", (req: Request, res, next) => {
    passport.authenticate('local', (err: AuthError | null, user: any, info?: { message: string }) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        // Return user data without sensitive information
        const { password, ...userData } = user;
        return res.json(userData);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Current user endpoint
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any; // Cast to any to access properties
      const isAdmin = user.level === 'admin';
      res.json({
        ...user,
        isAdmin,
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  
  // Forgot password endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find user by email
      const [user] = await getUserByEmail(email);
      
      if (!user) {
        // Don't reveal that the user doesn't exist for security reasons
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      }
      
      // Generate a reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Save token and expiry to user record
      await db.update(users)
        .set({
          resetToken,
          resetTokenExpiry
        })
        .where(eq(users.id, user.id));
      
      // Generate reset URL
      const resetUrl = `${process.env.FRONTEND_URL || req.headers.origin}/reset-password?token=${resetToken}`;
      
      // Generate and send email content
      const { html, text } = generatePasswordResetEmailContent(
        user.name,
        resetToken,
        resetUrl
      );
      
      await sendPasswordResetEmail({
        to: user.email,
        subject: "Password Reset Request",
        html,
        text
      });
      
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent" 
      });
      
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
  
  // Reset password endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      
      // Find user by reset token
      const [user] = await db.select()
        .from(users)
        .where(eq(users.resetToken, token))
        .limit(1);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Check if token is expired
      if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ message: "Token has expired" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(password);
      
      // Update user with new password and clear reset token
      await db.update(users)
        .set({
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        })
        .where(eq(users.id, user.id));
      
      return res.status(200).json({ message: "Password has been reset successfully" });
      
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });

  // Admin forgot password endpoint
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Find admin by username
      const [admin] = await getAdminByUsername(username);
      
      if (!admin) {
        // Don't reveal that the admin doesn't exist for security reasons
        return res.status(200).json({ 
          message: "If an account with that username exists, a password reset link has been sent" 
        });
      }
      
      // Generate a reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Save token and expiry to admin record
      await db.update(admins)
        .set({
          resetToken,
          resetTokenExpiry
        })
        .where(eq(admins.id, admin.id));
      
      // Generate reset URL
      const resetUrl = `${process.env.FRONTEND_URL || req.headers.origin}/admin/reset-password?token=${resetToken}`;
      
      // Generate and send email content
      const { html, text } = generatePasswordResetEmailContent(
        admin.fullName,
        resetToken,
        resetUrl
      );
      
      await sendPasswordResetEmail({
        to: admin.username, // Assuming username is the email for admins
        subject: "Admin Password Reset Request",
        html,
        text
      });
      
      return res.status(200).json({ 
        message: "If an account with that username exists, a password reset link has been sent" 
      });
      
    } catch (error) {
      console.error("Admin forgot password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
  
  // Admin reset password endpoint
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      
      // Find admin by reset token
      const [admin] = await db.select()
        .from(admins)
        .where(eq(admins.resetToken, token))
        .limit(1);
      
      if (!admin) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Check if token is expired
      if (!admin.resetTokenExpiry || new Date(admin.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ message: "Token has expired" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(password);
      
      // Update admin with new password and clear reset token
      await db.update(admins)
        .set({
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        })
        .where(eq(admins.id, admin.id));
      
      return res.status(200).json({ message: "Password has been reset successfully" });
      
    } catch (error) {
      console.error("Admin reset password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
}