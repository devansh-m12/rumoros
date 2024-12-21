'use client';

import WebsiteStats from "@/components/website/websiteStats";
import { useEffect, useState } from "react";

export default function WebsitePage({ params }: { params: { websiteId: string } }) {
    const [website, setWebsite] = useState<string>("");

    useEffect(() => {
        const fetchParams = async () => {
            const {websiteId} = await params;
            setWebsite(websiteId);
        };
        fetchParams();
    }, [params]);

    return <>
        <div className="flex flex-col gap-4">
            <WebsiteStats websiteId={website} />
        </div>
    </>
}