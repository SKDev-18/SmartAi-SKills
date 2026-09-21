import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying database readiness...');
  try {
    const count = await prisma.user.count();
    console.log(`Database verified: ${count} users active.`);
    if (count === 0) {
      console.log('Empty database detected. Running seed pipeline...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      execSync('node prisma/seed-all-learning-content.js', { stdio: 'inherit' });
    }
  } catch (err) {
    console.warn('Database self-heal check:', err.message);
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      execSync('node prisma/seed-all-learning-content.js', { stdio: 'inherit' });
    } catch (pushErr) {
      console.error('Database push failed:', pushErr.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
