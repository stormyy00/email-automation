import {
  Status,
  emails,
  removeEmail,
  updateEmail,
} from "@/utils/supabase/repository/emailRepository";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: UUID;
  };
};

type Props = {
  subject: string;
  status: Status;
  scheduled: number;
  templateId: string;
};

export const GET = async (req: NextRequest, { params }: Params) => {
  const res = (await emails())?.filter((email) => email.id == params.id);
  return NextResponse.json({ message: res ?? [] }, { status: 200 });
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  return NextResponse.json(
    {
      message: (await removeEmail(params.id))
        ? "Email does not exist."
        : "Email was deleted.",
    },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest, { params }: Params) => {
  const data = (await req.json().catch(() => undefined)) as Props | undefined;
  if (!data) {
    return NextResponse.json(
      {
        message:
          "Please provide the email's subject, body, status, and scheduled date.",
      },
      { status: 400 },
    );
  }
  await updateEmail(params.id, {
    subject: data.subject,
    status: data.status,
    scheduled_date: data.scheduled,
    templateId: data.templateId,
  });
  return NextResponse.json({ message: "Email was updated." }, { status: 200 });
};
