import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo anchors
  const anchorA = await prisma.anchor.upsert({
    where: { domain: 'anchor-a.stellar.demo' },
    update: {},
    create: {
      name: 'Anchor A - USD Services',
      domain: 'anchor-a.stellar.demo',
      publicKey: 'GANCHORADEMOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      requiredClaims: ['identity_verification', 'aml_check'],
      isActive: true,
    },
  });

  const anchorB = await prisma.anchor.upsert({
    where: { domain: 'anchor-b.stellar.demo' },
    update: {},
    create: {
      name: 'Anchor B - EUR Services',
      domain: 'anchor-b.stellar.demo',
      publicKey: 'GANCHORBDEMOBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      requiredClaims: ['identity_verification', 'age_verification'],
      isActive: true,
    },
  });

  console.log('✅ Created demo anchors:');
  console.log(`  - ${anchorA.name} (ID: ${anchorA.id})`);
  console.log(`  - ${anchorB.name} (ID: ${anchorB.id})`);

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
