import { UUID } from "crypto";
import { createClient } from "../server";

export type Status = "scheduled" | "sent" | "draft";

export type Email = {
  status: Status;
  subject: string;
  scheduled_date: number;
  templateId: string;
};

export const createEmail = async (email: Email): Promise<UUID> => {
  return (
    await (
      await createClient()
    )
      .from("emails")
      .insert({
        status: email.status,
        subject: email.subject,
        scheduled_date: email.scheduled_date,
        templateId: "",
      })
      .select()
  ).data?.at(0).id;
};

export const emails = async () => {
  const emails =
    (await (await createClient()).from("emails").select()).data ?? [];
  for (const x of emails) {
    x.recipients = await recipients(x.id);
  }
  return emails;
};

export const removeEmail = async (emailId: UUID) => {
  return (
    (await (await createClient()).from("emails").delete().eq("id", emailId))
      .error != null
  );
};

export const updateEmail = async (emailId: UUID, fields: object) => {
  await (await createClient()).from("emails").update(fields).eq("id", emailId);
};

export const addRecipient = async (emailId: UUID, userEmail: string) => {
  await (await createClient())
    .from("recipients")
    .insert({ email_id: emailId, user_email: userEmail });
};

export const recipients = async (emailId: UUID) => {
  return (
    await (await createClient())
      .from("recipients")
      .select()
      .eq("email_id", emailId)
  ).data;
};

export const removeRecipient = async (emailId: UUID, userEmail: string) => {
  await (await createClient())
    .from("recipients")
    .delete()
    .eq("email_id", emailId)
    .eq("user_email", userEmail);
};
