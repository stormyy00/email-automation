import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { body } = await req.json();
  console.log(body);
  try {
    return NextResponse.json({ message: "org created" }, { status: 200 });
  } catch (error) {
    console.error("failed to add org", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const { body } = await req.json();
  console.log(body);
  try {
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("failed to add org", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
