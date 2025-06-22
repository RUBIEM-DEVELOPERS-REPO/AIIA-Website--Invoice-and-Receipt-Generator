import { randomInt } from 'crypto';

export type MembershipType = 'Student Member' | 'Full Member' | 'Institutional Member' | 'Free Membership';

export function generateMemberKey(membershipType: MembershipType): string {
  // Get current year's last two digits
  const year = new Date().getFullYear().toString().slice(-2);
  
  // Generate 4 random numbers
  const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Determine letter based on membership type
  let letter: string;
  switch (membershipType) {
    case 'Student Member':
      letter = 'S';
      break;
    case 'Full Member':
      letter = 'F';
      break;
    case 'Institutional Member':
      letter = 'I';
      break;
    default:
      letter = 'N'; // N for None/Free membership
  }
  
  // Return formatted key
  return `${year}-${randomNumbers}-${letter}`;
}
