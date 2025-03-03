import {
  emails,
  removeEmail,
} from "@/utils/supabase/repository/emailRepository";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: UUID;
  };
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
