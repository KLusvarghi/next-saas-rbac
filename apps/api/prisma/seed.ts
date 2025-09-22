import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// criamos uma nova conexão com o banco de dados porque a outra nó exibimos a query, e nessa não queremos
const prisma = new PrismaClient();

async function seed() {
  // Deletar na ordem correta para respeitar as foreign keys
  await prisma.member.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("123456", 1);

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@acme.com",
      avatarUrl: "https://github.com/KLusvarghi.png",
      passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Admin)",
      slug: "acme-inc-admin",
      domain: "acme.com",
      avatarUrl: faker.image.avatar(),
      shouldAttachUserByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              // fazendo isso ele iár escolher apenas 1 dos 4 users para ser o owner
              // caso eu quisesse que escolhesse mais de um eu colocava "arrayElements" (no plural)
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "ADMIN",
            },
            {
              userId: user2.id,
              role: "MEMBER",
            },
            {
              userId: user3.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Member)",
      slug: "acme-inc-member",
      domain: "acme-member.com",
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              // fazendo isso ele iár escolher apenas 1 dos 4 users para ser o owner
              // caso eu quisesse que escolhesse mais de um eu colocava "arrayElements" (no plural)
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "MEMBER",
            },
            {
              userId: user2.id,
              role: "ADMIN",
            },
            {
              userId: user3.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Billing)",
      slug: "acme-inc-billing",
      domain: "acme-billing.com",
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              // fazendo isso ele iár escolher apenas 1 dos 4 users para ser o owner
              // caso eu quisesse que escolhesse mais de um eu colocava "arrayElements" (no plural)
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "BILLING",
            },
            {
              userId: user2.id,
              role: "ADMIN",
            },
            {
              userId: user3.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  });
}

seed().then(() => {
  console.log("Seed completed");
});
