import { access, addAccess, hasAccess, removeAccess } from "@/utils/supabase/repository/accessRepository"
import { NextRequest, NextResponse } from "next/server"

type Props = {
    email: string
}

export const GET = async () => {
    const res = await access()
    return NextResponse.json(
        { message: res ?? [] },
        { status: 200 }
    )
}

export const POST = async (request: NextRequest) => {
    const data = (await request.json().catch(() => undefined)) as
        | Props
        | undefined;
    if (!data) {
        return NextResponse.json(
            {
                message:
                    "Please provide an email address in a JSON body.",
            },
            { status: 400 },
        );
    }

    if ((await hasAccess(data.email))) {
        return NextResponse.json(
            { message: "This user already has access." },
            { status: 200 }
        )
    }

    await addAccess(data.email);
    return NextResponse.json(
        { message: "User has been granted access." },
        { status: 200 }
    )
}

export const DELETE = async (request: NextRequest) => {
    const data = (await request.json().catch(() => undefined)) as
        | Props
        | undefined;
    if (!data) {
        return NextResponse.json(
            {
                message:
                    "Please provide an email address in a JSON body.",
            },
            { status: 400 },
        );
    }

    if (!(await hasAccess(data.email))) {
        return NextResponse.json(
            { message: "This user does not have access." },
            { status: 200 }
        )
    }

    await removeAccess(data.email);
    return NextResponse.json(
        { message: "User access has been revoked." },
        { status: 200 }
    )
}