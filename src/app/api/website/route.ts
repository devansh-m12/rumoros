import { NextRequest } from "next/server";

import { createWebsite, getAllWebsites } from "@/actions/prisma/website";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {


    const websites = await getAllWebsites(session?.user?.id as string);
    return NextResponse.json(websites);
  } catch (error) {
    console.error("Error creating website", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, domain, shareId } = await req.json();
    const website = await createWebsite({
      createdBy: session?.user?.id as string,
      name,
      domain,
    });
    return NextResponse.json({
      message: 'Website created successfully',
      website: {
          id: website.id,
          name: website.name,
          domain: website.domain
      }
  },
  { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


