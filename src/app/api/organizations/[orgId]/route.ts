import { NextRequest, NextResponse } from "next/server";

type params = {
  params: { orgId: string };
};
export const GET = async (req: NextRequest, { params }: params) => {
  const { orgId } = params;

  try {
    return NextResponse.json({ message: orgId }, { status: 200 });
  } catch (error) {
    console.error("failed to add org", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
