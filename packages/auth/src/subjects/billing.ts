// billing não vai ser um recurso no banco de dados, mas sim uma um calculo que faremos (recurso que podemos gerenciar permissões)
import z from "zod";

export const billingSubject = z.tuple([
  z.union([z.literal("manager"), z.literal("get"), z.literal("export")]),
  z.literal("Billing"),
]);

export type BillingSubject = z.infer<typeof billingSubject>;
