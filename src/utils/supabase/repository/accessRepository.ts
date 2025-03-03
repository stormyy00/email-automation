import { createClient } from "../server";

export const addAccess = async (email: string) => {
  await (await createClient()).from("access").insert({ email: email });
};

export const access = async () => {
  return (await (await createClient()).from("access").select()).data;
};

export const removeAccess = async (email: string) => {
  await (await createClient()).from("access").delete().eq("email", email);
};

export const hasAccess = async (email: string) => {
  return (
    ((await (await createClient()).from("access").select().eq("email", email))
      .data?.length ?? 0) > 0
  );
};
