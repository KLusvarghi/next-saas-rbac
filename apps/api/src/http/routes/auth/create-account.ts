import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

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
    () => {
      return "User created";
    },
  );
}
