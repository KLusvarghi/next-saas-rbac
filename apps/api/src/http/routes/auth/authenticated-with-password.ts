import { compare } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "@/lib/prisma";

import { BadRequestError } from "../_errors";

export async function authenticatedWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/password",
    {
      schema: {
        summary: "Authenticate with password",
        description: "Authenticate with password",
        tags: ["auth"],
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        throw new BadRequestError("Invalid credentials");
      }

      if (userFromEmail.passwordHash === null) {
        throw new BadRequestError(
          "User does not have password, use social login",
        );
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      );

      if (!isPasswordValid) {
        throw new BadRequestError("Invalid credentials");
      }

      const token = await reply.jwtSign(
        // nessa primeira parte temos o payload do token, passamos o id do usuário e outras infos
        {
          // por padrão, retornamos o valor "sub" que significa "subject" e significa o usuário que está autenticado
          sub: userFromEmail.id,
        },
        // nesse segundo objeto temos as configurações do token, e definimos o tempo de expiração
        {
          sign: {
            expiresIn: "7d",
          },
        },
      );

      return reply.status(201).send({
        message: "Authenticated successfully",
        token,
      });
    },
  );
}
