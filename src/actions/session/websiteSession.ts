import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

function getTimestampDiffSQL(field1: string, field2: string): string {
    return `floor(extract(epoch from (${field2} - ${field1})))`;
}

export async function getWebsiteSession(websiteId: string, sessionId: string) {
  const query = Prisma.sql`
    SELECT 
      s.session_id as id,
      s.website_id as "websiteId",
      s.hostname,
      s.browser,
      s.os,
      s.device,
      s.screen,
      s.language,
      s.country,
      s.subdivision1,
      s.city,
      s.created_at as "firstAt",
      COALESCE(MAX(we.created_at), s.created_at) as "lastAt",
      CAST(COUNT(DISTINCT we.visit_id) AS INTEGER) as visits,
      CAST(SUM(CASE WHEN we.event_type = 1 THEN 1 ELSE 0 END) AS INTEGER) as views,
      CAST(SUM(CASE WHEN we.event_type = 2 THEN 1 ELSE 0 END) AS INTEGER) as events,
      CAST(COALESCE(SUM(${Prisma.raw(getTimestampDiffSQL('we.created_at', 'we.created_at'))}), 0) AS INTEGER) as "totaltime"
    FROM session s
    LEFT JOIN website_event we ON we.session_id = s.session_id
    WHERE s.website_id = ${websiteId}::uuid
      AND s.session_id = ${sessionId}::uuid
    GROUP BY 
      s.session_id,
      s.website_id,
      s.hostname,
      s.browser,
      s.os,
      s.device,
      s.screen,
      s.language,
      s.country,
      s.subdivision1,
      s.city,
      s.created_at;
  `;

  const result = await prisma.$queryRaw<any>(query);
  // console.log("result", result);
  return result?.[0];
}
