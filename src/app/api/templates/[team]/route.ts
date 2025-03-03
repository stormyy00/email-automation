import { templates } from "@/utils/supabase/repository/templateRepository";
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
