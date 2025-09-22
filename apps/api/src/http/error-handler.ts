import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "./routes/_errors";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // Verificar se o erro é ZodError diretamente
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    });
  }

  // Verificar se o erro tem uma propriedade validation (erro do fastify-type-provider-zod)
  if (error.validation) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.validation,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  console.error(error);

  // send error to some observability platform

  return reply.status(500).send({
    message: "Internal server error",
  });
};
