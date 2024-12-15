import { DATA_TYPE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { uuid } from "@/utils/helprFunc/crypto";
import { flattenJSON, getStringValue } from "@/utils/helprFunc/data";
import {Prisma} from "@prisma/client";

export async function saveEventData(data: {
    websiteId: string;
    eventId: string;
    eventData: any;
  }): Promise<any> {
    const { websiteId, eventId, eventData } = data;
  
    const jsonKeys = flattenJSON(eventData);
  
    // id, websiteEventId, eventStringValue
    const flattenedData = jsonKeys.map((a:any) => ({
      id: uuid(),
      websiteEventId: eventId,
      websiteId,
      dataKey: a.key,
      stringValue: getStringValue(a.value, a.dataType),
      numberValue: a.dataType === DATA_TYPE.number ? a.value : null,
      dateValue: a.dataType === DATA_TYPE.date ? new Date(a.value) : null,
      dataType: a.dataType,
    }));
  
    return prisma.eventData.createMany({
      data: flattenedData,
    });
  }