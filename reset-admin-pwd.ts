import { hashPassword } from './server/utils/password';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

async function reset() {
  const password = await hashPassword('password123');
  await db.update(users).set({ password }).where(eq(users.email, 'admin@aiinstituteafrica.com'));
  console.log('Password updated successfully');
  process.exit(0);
}
reset().catch(console.error);
