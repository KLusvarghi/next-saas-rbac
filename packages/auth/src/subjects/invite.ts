import z from "zod";

export const inviteSubject = z.tuple([
  z.union([
    z.literal("manager"),
    z.literal("get"),
    z.literal("create"),
    z.literal("revoke"),
  ]),
  z.literal("Invite"),
]);

export type InviteSubject = z.infer<typeof inviteSubject>;
