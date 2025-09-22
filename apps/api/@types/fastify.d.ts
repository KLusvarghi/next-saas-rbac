// para que a gente consiga inferir metodos no "request" e "reply", temos que add na tipagem do fastify
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    getCurrentUserId: () => Promise<string>;
  }
}
