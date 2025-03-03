import { UUID } from "crypto";
import { createClient } from "../server";

export type Template = {
    name: string,
    body: string
}

export const createTemplate = async (template: Template) => {
    (await createClient()).from('templates').insert({ name: template.name, body: template.body })
}

export const templates = async () => {
    return (await createClient()).from('templates').select()
}

export const removeTemplate = async (templateId: UUID) => {
    (await createClient()).from('templates').delete().eq("id", templateId)
}