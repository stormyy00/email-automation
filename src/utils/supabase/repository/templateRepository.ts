import { UUID } from "crypto";
import { createClient } from "../server";

export type Team = "operations" | "sponsorship";

export type Template = {
  name: string;
  body: string;
  team: Team;
};

export const createTemplate = async (template: Template) => {
  await (await createClient())
    .from("templates")
    .insert({ name: template.name, body: template.body, team: template.team });
};

export const updateTemplate = async (templateId: UUID, fields: object) => {
  await (await createClient())
    .from("templates")
    .update(fields)
    .eq("id", templateId);
};

export const templates = async (team?: string) => {
  return team
    ? (await (await createClient()).from("templates").select().eq("team", team))
        .data
    : (await (await createClient()).from("templates").select()).data;
};

export const removeTemplate = async (templateId: UUID) => {
  await (await createClient()).from("templates").delete().eq("id", templateId);
};
