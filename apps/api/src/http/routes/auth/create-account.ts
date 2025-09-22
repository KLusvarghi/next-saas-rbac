import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function createAccount(app: FastifyInstance) {
  // sempre que vamos criar uma rota "app" temos que usar o withTypeProvider<ZodTypeProvider>() para que o fastify use o tipo provider do Zod
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    // dentro desse objeto colocamos algumas confgs, e uma delas é o schema
    {
      schema: {
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
        return reply.status(400).send({
          message: "User with same email already exists",
        });
      }

      // o 6 é a forca do hash, quanto maior o numero, mais forte o hash
      // e quando maior, mais implica em performance
      const passwordHash = await hash(password, 6);

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      return reply.status(201).send();
    },
  );
}
