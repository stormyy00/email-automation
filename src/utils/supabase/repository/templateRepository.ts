import { UUID } from "crypto";
import { createClient } from "../server";

export type Team = "operations" | "sponsorship";

export type Template = {
    name: string,
    body: string,
    team: Team
}

export const createTemplate = async (template: Template) => {
    (await createClient()).from('templates').insert({ name: template.name, body: template.body, team: template.team })
}

export const templates = async (team?: Team) => {
    return team ? (await createClient()).from('templates').select().eq("team", team) : (await createClient()).from('templates').select()
}

export const removeTemplate = async (templateId: UUID) => {
    (await createClient()).from('templates').delete().eq("id", templateId)
}