import type { AbilityBuilder } from "@casl/ability";

import type { AppAbility } from ".";
import type { Role } from "./roles";

// tendo que passar "AppAbility" para que o builder saiba quais actions e subjects temos
type PermissionsByRole = (
  user: unknown,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  // ADMIN: () => {}, é a mesma coisa que ADMIN() {},
  // recebemos os dados dos user para ter um contexto de qual user é
  // e o "builder" é o builder do casl = const { build, can, cannot } = new AbilityBuilder(createAppAbility);
  // ADMIN(_, builder) { -> apenas desestruturamos o builder

  ADMIN(_, { can }) {
    can("manager", "all");
  },
  MEMBER(_, { can }) {
    can("get", "User");
  },
  BILLING(_, { can }) {
    can("get", "User");
  },
};
