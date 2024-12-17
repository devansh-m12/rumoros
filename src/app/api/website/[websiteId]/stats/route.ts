import { getWebsiteStats } from "@/actions/analytics/getWebsiteStats";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const statsQuerySchema = z.object({
  startAt: z.coerce.number().optional(),
  endAt: z.coerce.number().optional(),
  url: z.string().optional(),
  referrer: z.string().optional(),
  title: z.string().optional(),
  event: z.string().optional(),
  host: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  compare: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { websiteId: string } }) {
    try {
        const { websiteId } = await params;
        const { searchParams } = new URL(req.url);
        
        // Parse and validate query parameters
        const queryParams = Object.fromEntries(searchParams.entries());
        const validatedParams = statsQuerySchema.parse(queryParams);

        // Convert startAt and endAt to Date objects if they exist, otherwise use initial and end time
        const startAt = validatedParams.startAt ? new Date(validatedParams.startAt) : new Date(0); // Initial time
        const endAt = validatedParams.endAt ? new Date(validatedParams.endAt) : new Date(); // Current time

        // Get current period stats
        const stats = await getWebsiteStats(websiteId, startAt, endAt);

        
        // Check if stats is null
        if (!stats) {
            return NextResponse.json({ 
                error: "No stats found for the given website" 
            }, { status: 404 });
        }

        // If comparison is requested, get previous period stats
        let compareStats = null;
        if (validatedParams.compare) {
            const compareStartAt = new Date(startAt.getTime() - (endAt.getTime() - startAt.getTime()));
            const compareEndAt = startAt;
            compareStats = await getWebsiteStats(websiteId, compareStartAt, compareEndAt);
        }

        return NextResponse.json({
            success: true,
            data: {
                current: stats,
                previous: compareStats || null,
            },
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching website stats:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                success: false,
                error: "Invalid parameters",
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: false,
            error: "Internal server error" 
        }, { status: 500 });
    }
}