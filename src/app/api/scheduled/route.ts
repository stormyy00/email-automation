import { Email, emails } from "@/utils/supabase/repository/emailRepository";
import { NextResponse } from "next/server";

export const GET = async () => {
  const result = (await emails()) as Email[];
  for (const x of result) {
    const scheduled = new Date(x.scheduled_date);
    const now = new Date();
    if (x.status === "scheduled" && scheduled <= now) {
      console.log(x, "is supposed to be sent");
    }
  }
  return NextResponse.json({ message: result }, { status: 200 });
};
