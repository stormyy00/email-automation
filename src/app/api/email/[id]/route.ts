import { sendEmail } from "@/utils/email";
import {
  Status,
  addRecipient,
  emails,
  removeEmail,
  updateEmail,
} from "@/utils/supabase/repository/emailRepository";
import { templates } from "@/utils/supabase/repository/templateRepository";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: UUID;
  };
};

type Props = {
  recipients: string[];
  subject: string;
  status: Status;
  scheduled: number;
  templateId: string;
  sendNow: boolean;
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
  try {
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

    const supabase = await createClient();
    await supabase.from("recipients").delete().eq("emailId", params.id);
    await Promise.all(
      data.recipients.map((rec) => addRecipient(params.id, rec)),
    );
    const template = (await templates())?.find((t) => t.id === data.templateId);
    if (!template) {
      return NextResponse.json(
        { message: "Template not found." },
        { status: 404 },
      );
    }

    if (data.sendNow) {
      const recipients = Array.from(new Set(data.recipients));
      if (recipients.length > 0) {
        await sendEmail(data.subject, template.body, recipients);
      }
    }

    // Update email record
    await updateEmail(params.id, {
      subject: data.subject,
      status: data.status,
      scheduled_date: data.scheduled,
      templateId: data.templateId,
    });

    return NextResponse.json(
      { message: "Email was updated." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
