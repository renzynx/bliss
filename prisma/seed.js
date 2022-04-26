const argon = require('argon2');
const { PrismaClient } = require('@prisma/client');
const { randomBytes } = require('crypto');

(async () => {
  try {
    const prisma = new PrismaClient();

    const count = await prisma.user.count();

    if (count > 0) {
      console.log('Database is already seeded');
      return;
    }

    const password = randomBytes(16).toString('hex');

    const hashedPassword = await argon.hash(password);

    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        token: randomBytes(32).toString('hex'),
      },
    });

    console.log(`
    Admin created!
    Username: admin
    Password: ${password}
  `);
  } catch (error) {
    console.log(`Failed to seed the database ${error.message}`);
  }
})();
