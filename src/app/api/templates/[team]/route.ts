import { NextRequest } from "next/server";

type Params = {
    params: {
        team: string;
    }
}

export const GET = async (req: NextRequest, { params }: Params) => {
    const { team } = params;
}