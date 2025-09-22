// import { defineAbilityFor } from "@saas/auth";
// import { projectSchema } from "@saas/auth/src/models";

// // dentro dessa const eu tenho toda a ability do user ADMIN
// const ability = defineAbilityFor({ role: "MEMBER", id: "user-id" });

// const userCanINveteSOmeneELse = ability.can("manager", "User");

// console.log(userCanINveteSOmeneELse);

// // outra coisa do CASL é que se a gente quer validar se o user ele pode deletar um projeto por exemplo, ele pode, mas apenas se ele for o owner do projeto, e pra isso temos que passa o objeto de "projeto", que contenha todos os dados do projeto necessários para validar a permissão
// console.log(ability.can("delete", "Project")); //TRUE -> por que não passamos o objeto de projeto, então não valida as condicionais

// const project = projectSchema.parse({
//   id: "project-id",
//   ownerId: "user-id",
// });

// console.log(ability.can("delete", project)); //TRUE -> por que passamos o objeto de projeto, então valida as condicionais

// const project2 = projectSchema.parse({
//   id: "project-id",
//   ownerId: "user2-id", // id do owner é diferente do id do user
// });

// console.log(ability.can("delete", project2)); //FALSE -> por que passamos o objeto de projeto, então valida as condicionais
