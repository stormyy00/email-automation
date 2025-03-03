import { createTemplate } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    await createTemplate({
        templateId: crypto.randomUUID(),
        templateName: "Test",
        templateSubject: "Baaa",
        templateBody: "AAaaa"
    }).catch(console.error)
    return NextResponse.json({ message: "hi" }, { status: 200 })
}