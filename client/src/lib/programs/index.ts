/**
 * IMAGE MAPPING – AIIA PROGRAM FLYERS (UPDATED)
 *
 * AIIA FLYERS LATES-2  -> Basic AI Certification
 * AIIA FLYERS LATES-5  -> (unused, unchanged import)
 * AIIA FLYERS LATES-6  -> All Corporate Programs
 * AIIA FLYERS LATES-7  -> Postgrad AI Diploma (CHANGED)
 * AIIA FLYERS LATES-10 -> AI Diploma Program
 * AIIA FLYERS LATES-12 -> Graduate AI Certificate Program
 * AIIA FLYERS LATES-13 -> Non-Graduate AI Certificate
 * AIIA FLYERS LATES-16 -> Advanced AI Certification (CHANGED)
 */

import basicAiCert from "./AIIA FLYERS LATES-2.jpg";
import aiDiploma from "./AIIA FLYERS LATES-10.jpg";
import graduateAiCert from "./AIIA FLYERS LATES-12.jpg";
import postgradAiDiploma from "./AIIA FLYERS LATES-7.jpg"; // ✅ CHANGED
import nonGraduateAiCert from "./AIIA FLYERS LATES-13.jpg";
import advancedAiCert from "./AIIA FLYERS LATES-16.jpg"; // ✅ CHANGED
import masterAiOrgs from "./AIIA FLYERS LATES-6.jpg";
import certificationsOverview from "./AIIA FLYERS LATES-16.jpg"; // unchanged

// ✅ IOBZ additions ONLY
import iobzAppliedAi from "./IMG-20260121-WA0481(2).jpg";
import iobzLogo from "./IOBZ-Logo-Final-271x300.webp";

export const programImages = {
  basicAiCert,
  aiDiploma,
  graduateAiCert,
  postgradAiDiploma,
  nonGraduateAiCert,
  advancedAiCert,
  masterAiOrgs,
  certificationsOverview,

  // ✅ IOBZ
  iobzAppliedAi,
  iobzLogo,
};

export const iobzAppliedAiContent = {
  title: "IoBZ AI Training for Bankers",
  partner: "Institute of Bankers of Zimbabwe (IOBZ)",
  audience: "Finance, HR, Marketing, Operations, Procurement & Management Professionals",
  duration: "3 Days",
  venue: "TBA",
  award: "Certificate of Completion",
  summary:
    "Applied AI for Business Professionals equips banking professionals with knowledge and practical skills to use AI safely, effectively, and responsibly in daily work. ",

  objectives: [
    "Build AI literacy for business and professional environments",
    "Translate business problems into AI opportunities",
    "Understand how AI systems work across their lifecycle",
    "Assess AI value, risk, and feasibility",
    "Apply responsible and ethical AI principles",
    "Prepare professionals for AI-enabled work and decision-making",
  ],

  outcomes: [
    "Confident use of AI tools in daily professional tasks",
    "Ability to interpret AI outputs and limitations",
    "Identification of AI use cases relevant to functional roles",
    "Understanding of AI governance, ethics, and compliance",
    "Contribution to AI-driven organisational transformation",
  ],

  modules: [
    "AI Literacy for Professionals",
    "Generative AI in Daily Work",
    "Interpreting AI Outputs",
    "Responsible & Secure AI Use",
    "Applying AI to Your Function",
  ],

  applicationRouting: {
    notifyEmails: [
      "marvellous@iobz.co.zw",
      "munyika@iobz.co.zw",
      "admin@aiinstituteafrica.com",
    ],
    showCorporateFields: true,
  },
};
