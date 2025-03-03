import {
  Team,
  Template,
  createTemplate,
  removeTemplate,
  templates,
} from "@/utils/supabase/repository/templateRepository";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    team: string;
  };
};

export const GET = async () => {
  const templateList = await templates();
  return NextResponse.json({ message: templateList ?? [] }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json().catch(() => undefined)) as
    | Template
    | undefined;
  if (!data) {
    return NextResponse.json(
      {
        message: "Please provide the template's name and body.",
      },
      { status: 400 },
    );
  }

  await createTemplate({
    body: data.body,
    name: data.name,
    team: data.team as Team,
  });

  return NextResponse.json(
    {
      message: "Successfully created template.",
    },
    { status: 200 },
  );
};

export const DELETE = async (req: NextRequest) => {
  const body = await req.json();
  return NextResponse.json(
    // {
    //   message: (await removeTemplate(body))
    //     ? "Email does not exist."
    //     : "Email was deleted.",
    // },
    { status: 200 },
  );
};
