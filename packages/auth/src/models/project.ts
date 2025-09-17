import z from "zod";

// eu não vou armazerar todas as colunas que essa entidade tem no banco de dados, apenas as que são importantes para a parte de premissionamento
export const projectSchema = z.object({
  // depois de adicionar dentro de /models/project.ts que o subject tem esses campos abaixo, precismos de alguma maneira, identificar a qual subject esses campos pertencem, e para isso fazemos:
  // o nome "__typename" é uma convenção para identificar a qual subject esses campos pertencem, mas pode ser qualquer outro nome
  __typename: z.literal("Project").default("Project"), // e o "default" é para caso não seja passado, ele vai ser "Project", assim não temos o trabalho de passar o "__typename" sempre
  id: z.string(),
  ownerId: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
