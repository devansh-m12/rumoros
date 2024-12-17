import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getWebsiteById } from "@/actions/prisma/website";
import { NextResponse } from "next/server";
import { getUserById } from "@/actions/prisma/users";

export async function GET(req: NextRequest, { params }: { params: { websiteId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const {websiteId} = await params;
        const website = await getWebsiteById(websiteId);
        const user = await getUserById(website?.createdBy as string);
        console.log(website);
        const data = {
            websiteId: website?.id,
            websiteName: website?.name,
            websiteDomain: website?.domain,
            websiteShareId: website?.shareId,
            websiteCreatedBy: user?.username,
            websiteCreatedAt: website?.createdAt,
        }
        return NextResponse.json({
            success: true,
            data,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching website", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}