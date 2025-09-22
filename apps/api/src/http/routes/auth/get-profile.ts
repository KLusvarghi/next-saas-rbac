import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { auth } from "@/http/middleware/auth";
import { prisma } from "@/lib/prisma";

import { NotFoundError } from "../_errors";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth) // registrando o middleware de autenticação
    .get(
      "/profile",
      {
        schema: {
          summary: "Get authenticated user profile",
          description: "Get authenticated user profile",
          tags: ["auth"],
          headers: z.object({
            authorization: z.string(),
          }),
          response: {
            200: z.object({
              message: z.string(),
              user: z.object({
                id: z.string(),
                // o nullable é para que o zod possa aceitar valores nulos
                name: z.string().nullable(),
                email: z.string(),
                avatarUrl: z.url().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        // const { sub } = await request.jwtVerify<{ sub: string }>();
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          where: {
            // id: sub,
            id: userId,
          },
        });

        if (!user) {
          throw new NotFoundError("User not found");
        }

        return reply.status(200).send({
          message: "Profile fetched successfully",
          user,
        });
      },
    );
}
