import { NextResponse } from "next/server";
import { UUID } from "crypto";
type Params = {
  params: {
    orgId: UUID;
  };
};

export const GET = async ({ params }: Params) => {
  const res = params.orgId;
  try {
    return NextResponse.json({ message: res }, { status: 200 });
  } catch (error) {
    console.error("failed to add org", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
