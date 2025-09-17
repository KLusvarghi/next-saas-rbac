// é um array de 2 posições, a primeira posição é uma action e a segunda posição é um subject

import z from "zod";

// e usando "array" nós podemos adicionar mais posições, o que não é o caso de uma tupla
export const userSubject = z.tuple([
  // como a primeira posição são actions, e nelas utilizamos "ou" (|), nós podemos usar o "z.union" para unir as actions
  // e não podemos passar os valores diretamente, temos que tipar esses valores com o "z.literal", usamos o "z.literal" porque tem que ser exatamente a string que passamos
  z.union([
    z.literal("manager"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  z.literal("User"),
]);

export type UserSubject = z.infer<typeof userSubject>;
