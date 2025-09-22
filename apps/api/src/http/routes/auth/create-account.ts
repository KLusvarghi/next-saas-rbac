// import fastifySwaggerUI from "@fastify/swagger-ui";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";

import { prisma } from "@/lib/prisma";

import { BadRequestError } from "../_errors";

export async function createAccount(app: FastifyInstance) {
  // sempre que vamos criar uma rota "app" temos que usar o withTypeProvider<ZodTypeProvider>() para que o fastify use o tipo provider do Zod
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    // dentro desse objeto colocamos algumas confgs, e uma delas é o schema
    {
      schema: {
        summary: "Create a new user",
        description: "Create a new user",
        tags: ["auth"],
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError("User with same email already exists");
      }

      // pegando apenas o dominio do email
      const [, domain] = email.split("@");

      // procuramos se existe alguma organization com tem aquele dominio pré configurado
      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUserByDomain: true,
        },
      });

      // o 6 é a forca do hash, quanto maior o numero, mais forte o hash
      // e quando maior, mais implica em performance
      const passwordHash = await hash(password, 6);

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          // e aqui inserimos ou não o usuário a uma organização
          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                  // nao inserimos a role, pq por padrão já é MEMBER
                },
              }
            : undefined,
        },
      });

      return reply.status(201).send();
    },
  );
}
