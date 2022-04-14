import * as prompt from 'prompt';
import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';
const prisma = new PrismaClient();

const seed = async () => {
  prompt.start();

  prompt.get(['username', 'password', 'isAdmin'], async (err, result) => {
    const hashedPassword = await argon.hash(result.password as string);
    const token = randomBytes(32).toString('hex');

    await prisma.user.create({
      data: {
        username: result.username as string,
        password: hashedPassword,
        token,
        admin: result.isAdmin.toString().toLowerCase() === 'y',
      },
    });

    console.log('User created');

    process.exit();
  });
};

seed();
