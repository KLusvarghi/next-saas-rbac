import type { AbilityBuilder } from "@casl/ability";

import type { AppAbility } from ".";
import type { User } from "./models";
import type { Role } from "./roles";

// tendo que passar "AppAbility" para que o builder saiba quais actions e subjects temos
type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  // ADMIN: () => {}, é a mesma coisa que ADMIN() {},

  // e o "builder" é o builder do casl = const { build, can, cannot } = new AbilityBuilder(createAppAbility);

  // ADMIN(_, builder) { -> apenas desestruturamos o builder

  ADMIN(user, { can, cannot }) {
    can("manager", "all");

    // é de se pensar qe fazer isso é mais fácil e simples de entender, e é, porém o CASL não suporta isso, então temos que fazer de outra maneira

    // cannot('transfer_ownership', 'Organization', { ownerId: { $ne: user.id } }); // aqui dizemos que o ADMIN não pode transferir uma ownership que o ownerId de uma organização não seja o mesmo que o id dele

    // mas no CASL, quando a gente da a permissão de fazer tudo "can('manager', 'all');", em seguida, as negações não podem ter condicionais. E fazer igual o exemplo acima de querer restringir uma ação, não é possível

    // Então, temos que negar primeiro a ação que queremos restringir, e depois ir dando permissões aos poucos, usando o can com condicionais
    cannot(["transfer_ownership", "update"], "Organization");
    // nesse caso, queremos dizer que um user só pode atualizar e deletar o seu próprio user, e pra isso fazemos as condicionais:
    can(["transfer_ownership", "update"], "Organization", {
      ownerId: { $eq: user.id },
    });
  },
  // recebemos os dados dos user para ter um contexto das propriedades do user
  MEMBER(user, { can }) {
    // no Member nunca daremos permissão all, vamos apenas dando permissões aos poucos
    can("get", "User"); // pode listar todos os users
    can(["create", "get"], "Project");
    can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
  },
  BILLING(_, { can }) {
    can("manager", "Billing");
  },
};
