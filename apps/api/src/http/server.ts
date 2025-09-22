import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { createAccount } from "./routes";

// Aqui criamos uma instância do Fastify e associamos o Type Provider do Zod.
// Isso é importante porque permite que o Fastify utilize os esquemas do Zod para validar e tipar automaticamente
// tanto os dados de entrada (requisições) quanto de saída (respostas) das rotas da API.
// Dessa forma, garantimos maior segurança e consistência nos dados trafegados pela aplicação.
const app = fastify().withTypeProvider<ZodTypeProvider>();

// dizemos como o fastify vai serializar os dados da resposta
// serelizar é o processo de transformar os dados de entrada e saida das nossos endpoints
app.setSerializerCompiler(serializerCompiler);

// dizemos como o fastify vai validar os dados da requisição
app.setValidatorCompiler(validatorCompiler);

// vai permitir que qualquer aplicação possa acessar a nossa API
app.register(fastifyCors);

app.register(createAccount);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
