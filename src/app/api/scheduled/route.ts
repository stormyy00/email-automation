import { sendEmail } from "@/utils/email";
import {
  Email,
  emails,
  updateEmail,
} from "@/utils/supabase/repository/emailRepository";
import { templates } from "@/utils/supabase/repository/templateRepository";
import { UUID } from "crypto";
import { NextResponse } from "next/server";

type Recipient = {
  email_id: UUID;
  user_email: string;
};

export const GET = async () => {
  try {
    const result = (await emails()) as ({
      recipients: Recipient[];
      id: UUID;
    } & Email)[];
    for (const x of result) {
      const scheduled = new Date(x.scheduled_date);
      const now = new Date();
      if (x.status === "scheduled" && scheduled <= now) {
        const template = (await templates())?.filter(
          (template) => template.id === x.templateId,
        )[0];
        const recipients = Array.from(
          new Set(x.recipients.map((val) => val.user_email)),
        );
        if (!recipients || recipients.length == 0) {
          continue;
        }
        await sendEmail(x.subject, template.body, recipients);
        await updateEmail(x.id, {
          status: "sent",
        });
      }
    }
    return NextResponse.json({ message: result }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
};
