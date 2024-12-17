import { prisma } from '@/lib/prisma';
import { EVENT_TYPE } from '@/lib/constants';
import { getTimestampDiffSQL } from '../session/websiteSession';

export async function getWebsiteStats(
  websiteId: string,
  startAt?: Date,
  endAt?: Date,
): Promise<{
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}[]> {
  if (!websiteId) {
    return [{ pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 }];
  }

  try {
    // Get all pageview events for the website within the date range
    const events = await prisma.websiteEvent.findMany({
      where: {
        websiteId,
        eventType: EVENT_TYPE.pageView,
        createdAt: {
          ...(startAt && endAt ? {
            gte: startAt,
            lte: endAt
          } : {})
        }
      },
      select: {
        sessionId: true,
        visitId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!events.length) {
      return [{ pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 }];
    }

    // Group events by visit
    const visitMap = new Map<string, {
      sessionId: string,
      events: { createdAt: Date }[]
    }>();

    events.forEach(event => {
      if (!visitMap.has(event.visitId)) {
        visitMap.set(event.visitId, {
          sessionId: event.sessionId,
          events: []
        });
      }
      visitMap.get(event.visitId)?.events.push({
        createdAt: event.createdAt ?? new Date()
      });
    });

    // Calculate stats
    const uniqueSessionIds = new Set(events.map(e => e.sessionId));
    const visits = Array.from(visitMap.values());
    
    const stats = {
      pageviews: events.length,
      visitors: uniqueSessionIds.size,
      visits: visits.length,
      bounces: visits.filter(visit => visit.events.length === 1).length,
      totaltime: visits.reduce((total, visit) => {
        if (visit.events.length < 2) return total;
        const duration = Math.floor(
          (visit.events[visit.events.length - 1].createdAt.getTime() - 
           visit.events[0].createdAt.getTime()) / 1000
        );
        return total + duration;
      }, 0)
    };

    return [stats];

  } catch (error) {
    console.error('Error in getWebsiteStats:', error);
    return [{ pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 }];
  }
}
