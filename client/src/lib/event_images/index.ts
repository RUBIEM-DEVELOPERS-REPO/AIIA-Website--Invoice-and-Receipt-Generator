// client/src/lib/event_images/index.ts

/**
 * SUMMIT IMAGE MAPPING (final – aligned with posters in use)
 *
 * IMG-20260115-WA0121 -> Zimbabwe 2.0 – AI for National Transformation
 * IMG-20260111-WA0030 -> AI Tech Forum Zimbabwe
 * IMG-20260111-WA0010 -> AI Education Africa
 * IMG-20260109-WA0245 -> AI Africa Summit
 */

import zim2 from "./IMG-20260115-WA0121.jpg";
import techForum from "./IMG-20260111-WA0030.jpg";
import aiEducation from "./IMG-20260111-WA0010.jpg";
import aiAfricaSummit from "./IMG-20260109-WA0245.jpg";

export const summitImages = {
  zim2,           // Zimbabwe 2.0
  techForum,      // AI Tech Forum Zimbabwe
  aiEducation,    // AI Education Africa
  aiAfricaSummit, // AI Africa Summit
} as const;
