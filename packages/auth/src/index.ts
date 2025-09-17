import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import z from "zod";

import type { User } from "./models";
import { permissions } from "./permissions";
import {
  billingSubject,
  inviteSubject,
  organizationSubject,
  projectSubject,
  userSubject,
} from "./subjects";

// "manager" e "all" são as ações e os sujeitos do sistema (internas do casl)
// manager da permissão de executar todas as ações sobre todos os sujeitos
// all da permissão de executar as ações sobre todos os subjects / entidades
// const actions = ["manage", "invite", "delete"] as const;
// const subjects = ["User", "all"] as const;

// type AppAbilities = [
//   (typeof actions)[number],
//   (
//     | (typeof subjects)[number]
//     | ForcedSubject<Exclude<(typeof subjects)[number], "all">>
//   ),
// ];

// ao invés de usar o tipo acima que nos causava o probelma de poder atribuir uma action indevidamentea um subject , vamos usar o tipo abaixo
// que nos permite atribuir actions a um subject específico
// e para que a gente ainda contiue com o "all" conforme o CASL nos deu por padrão, vamos criar um tipo que é a união dos tipos UserSubject e ProjectSubject
// primeiro a action depois o subject

// poderiamos fazer assim ou usar zod:
// export type AppAbilities =
//   | UserSubject
//   | ProjectSubject
//   | OrganizationSubject
//   | InviteSubject
//   | BillingSubject
//   | ["manager", "all"];

const appAbilitySchema = z.union([
  userSubject,
  projectSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal("manager"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitySchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

// definindo as permissões do user
// por padrão, as entidades não tem permissão para nada

// const { build, can, cannot } = new AbilityBuilder(createAppAbility);
// can('manage', 'all')
// can('invite', 'User')
// export const ability = build();

// ao invés de ter uma ability (conjunto de permissões) para todo mundo (igual o código comentado acima),
// vamos definir uma ability para cada user (definida pela função defineAbilityFor)

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  // eu verifico se dentro do meu objeto de permissões, existe uma função com a role do user recebido comp params nesta função
  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permission for role ${user.role} not found`);
  }

  // caso existam, eu chamo a função que está dentro do meu objeto de permissões, passando o a role do user recebido como params

  permissions[user.role](user, builder);

  // dentro do "build" ele tem o objeto de configurações, que é onde irei dizer o type do subject
  const ability = builder.build({
    // e nesse caso como o nosso "builder" pode ser qualquer subject, vamos usar a função "detectSubjectType" para detectar o type do subject, que recebe o subject como params
    // e como nos implemenamos o "__typename" no nosso subject, vamos retornar o "__typename" do subject que irá dizer a qual subject ele pertence
    detectSubjectType(subject) {
      return subject.__typename; // dizemos ao CASL que o type do subject é o "__typename" do subject
    },
  });

  return ability;
}
