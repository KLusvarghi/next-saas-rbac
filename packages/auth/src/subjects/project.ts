// porque usamos "tupla" ao invés de um array?
// poruqe uma tupla é um array de tamanho fixo (de duas posições)e não pode ser alterado

import z from "zod";

import { projectSchema } from "../models";

// e usando "array" nós podemos adicionar mais posições, o que não é o caso de uma tupla
export const projectSubject = z.tuple([
  // como a primeira posição são actions, e nelas utilizamos "ou" (|), nós podemos usar o "z.union" para unir as actions
  // e não podemos passar os valores diretamente, temos que tipar esses valores com o "z.literal", usamos o "z.literal" porque tem que ser exatamente a string que passamos
  z.union([
    z.literal("manager"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  // z.literal("Project"),

  // ao invés de tipar apenas como "Project" (como está acima), vamos tipar com "projectSchema" tambem
  // ao fazer isso, dentro de permissions fica mais fácil de entender as propriedades do "Project" que é o "projectSchema", facilitando na hora de fazer condicionamento com os campos de "project" lá em "permissions"
  z.union([z.literal("Project"), projectSchema]),
]);

// é um array de 2 posições, a primeira posição é uma action e a segunda posição é um subject
export type ProjectSubject = z.infer<typeof projectSubject>;
