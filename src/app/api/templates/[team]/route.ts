import {
  Team,
  Template,
  createTemplate,
  templates,
} from "@/utils/supabase/repository/templateRepository";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    team: string;
  };
};

export const GET = async (req: NextRequest, { params }: Params) => {
  const { team } = params;
  const templateList = await templates(team);
  return NextResponse.json({ message: templateList ?? [] }, { status: 200 });
};

export const POST = async (req: NextRequest, { params }: Params) => {
  const { team } = params;
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
    team: team as Team,
  });

  return NextResponse.json(
    {
      message: "Successfully created template.",
    },
    { status: 200 },
  );
};
