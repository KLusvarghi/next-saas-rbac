import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { errorHandler } from "./error-handler";
import { authenticatedWithPassword, createAccount, getProfile } from "./routes";

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

// a gente registra o error handler, que seria um middleware que vai capturar os erros e tratar eles só que nativo do fastify (plugin)
app.setErrorHandler(errorHandler);

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

// para que o fastify possa gerar tokens JWT temos que registrar o plugin
app.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});

// vai permitir que qualquer aplicação possa acessar a nossa API
app.register(fastifyCors);

// registro das rotas

// AUTH
app.register(createAccount);
app.register(authenticatedWithPassword);
app.register(getProfile);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
