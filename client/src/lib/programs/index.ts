// client/src/lib/programs/index.ts

/**
 * IMAGE MAPPING (per your instruction)
 * IMG-20260115-WA0114 -> Master AI programs for corporates
 * IMG-20260115-WA0116 -> Basic AI Certification
 * IMG-20260115-WA0117 -> AI Diploma
 * IMG-20260115-WA0118 -> Postgrad AI Diploma
 * IMG-20260115-WA0119 -> Non-Graduate Certificate
 * IMG-20260115-WA0063 -> Graduate AI Certificate
 * IMG-20260115-WA0120 -> Advanced AI Certification
 */

import masterOrgs from "./IMG-20260115-WA0114.jpg";
import basic from "./IMG-20260115-WA0116.jpg";
import aiDiploma from "./IMG-20260115-WA0117.jpg";
import postgradDiploma from "./IMG-20260115-WA0118.jpg";
import nongrad from "./IMG-20260115-WA0119.jpg";
import gradCert from "./IMG-20260115-WA0063.jpg";
import advanced from "./IMG-20260115-WA0120.jpg";

// (Optional) keep catalogue if you still use it elsewhere
// If you don't have a catalogue poster anymore, remove this line and key.
// import catalogue from "./IMG-20260115-WA0115.jpg";

export const programImages = {
  masterOrgs,
  basic,
  aiDiploma,
  postgradDiploma,
  nongrad,
  gradCert,
  advanced,
  // catalogue,
};
