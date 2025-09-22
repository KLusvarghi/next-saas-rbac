// Para que a gente consiga fazer com que a gente registre e funcione esse midr, ou como chamam muito de hook ou plugin, a gente precisa instalar o Fashify Plugin, porque acontece que nativamente o Fashify trata esse midr, ou esse hook, de forma que a gente registra essa funcionalidade dentro do app, porém ele só funciona dentro do mesmo arquivo. Então, por exemplo, se fosse um midr de error handling, por exemplo, que ele tratasse tudo aí dentro e a gente não precisava fazer mais nada, não precisava registrar ele em nenhuma rota, ok, ele funcionaria. Só que, quando a gente tem que criar um midr que precisa ser registrado nas rotas, a gente precisa instalar esse Fashify Plugin, para que a gente consiga registrar ele nas rotas e elas consigam utilizar o que a gente adicionou. Por exemplo, a gente adicionou, nesse caso, foi o método getCurrencyUserId. Então, para que as rotas consigam utilizar esse método, a gente precisa utilizar esse Fashify Plugin, para que assim elas não interpretem isso como uma função. Porque se a gente deixar só do jeito aqui, a gente vai receber o erro de getCurrencyUserId is not a function.

import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import { UnauthorizedError } from "../routes/_errors";

// assim esse metodo pode ser usado externamente por uma rota
export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  // o hook é um middleware que é executado antes de cada rota
  app.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        console.log("request.jwtVerify");
        const { sub } = await request.jwtVerify<{ sub: string }>();

        return sub;
      } catch {
        throw new UnauthorizedError("Invalid auth token");
      }
    };
  });
});
