import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
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

// A gente registra o swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Next.js Saas",
      description: "Fullstack SaaS app with multi-tenant and RBAC",
      version: "1.0.0",
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

// a gente registra o swagger ui para poder visualizar na web
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// vai permitir que qualquer aplicação possa acessar a nossa API
app.register(fastifyCors);

app.register(createAccount);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
