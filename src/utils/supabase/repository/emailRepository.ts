import { UUID } from "crypto";
import { createClient } from "../server";

export type Status = "scheduled" | "sent" | "draft";

export type Email = {
    status: Status,
    subject: string
    scheduled: Date
}

export const createEmail = async (email: Email) => {
    (await createClient()).from('emails').insert({ status: email.status, subject: email.subject, scheduled_date: email.scheduled.getTime() })
}

export const emails = async () => {
    return (await createClient()).from('emails').select()
}

export const removeEmail = async (emailId: UUID) => {
    (await createClient()).from('emails').delete().eq("id", emailId)
}

export const addRecipient = async (emailId: UUID, userEmail: string) => {
    (await createClient()).from('recipients').insert({ email_id: emailId, user_email: userEmail })
}

export const removeRecipient = async (emailId: UUID, userEmail: string) => {
    (await createClient()).from('recipients').delete().eq("email_id", emailId).eq("user_email", userEmail)
}