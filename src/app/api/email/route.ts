import {
  Email,
  addRecipient,
  createEmail,
  emails,
  removeEmail,
} from "@/utils/supabase/repository/emailRepository";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  subject: string;
  recipients: string[];
  scheduled: number;
  isDraft: boolean;
};

export const GET = async () => {
  const res = await emails();
  return NextResponse.json({ message: res ?? [] }, { status: 200 });
};

export const PUT = async (req: NextRequest) => {
  const data = (await req.json().catch(() => undefined)) as Props | undefined;
  if (!data) {
    return NextResponse.json(
      {
        message:
          "Please provide the email's subject, recipients, and the scheduled send date.",
      },
      { status: 400 },
    );
  }
  const email = {
    status: data.isDraft ? "draft" : "scheduled",
    subject: data.subject,
    scheduled_date: data.scheduled,
  } as Email;
  const result = await createEmail(email);
  data.recipients.forEach(async (recp) => await addRecipient(result, recp));
  return NextResponse.json(
    { message: "Email created.", id: result },
    { status: 200 },
  );
};

export const DELETE = async (req: NextRequest) => {
  const ids = await req.json();

  const idList = Array.isArray(ids) ? ids : [ids];
  const results = await Promise.all(
    idList.map(async (id) => ({
      id,
      status: (await removeEmail(id))
        ? "Email does not exist."
        : "Email was deleted.",
    })),
  );

  return NextResponse.json({ message: results }, { status: 200 });
};
