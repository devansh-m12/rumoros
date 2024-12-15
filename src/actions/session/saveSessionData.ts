import { DATA_TYPE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { uuid } from "@/utils/helprFunc/crypto";
import { flattenJSON, getStringValue } from "@/utils/helprFunc/data";

export async function saveSessionData(data: {
    websiteId: string;
    sessionId: string;
    sessionData: any;
  }) {
    const { websiteId, sessionId, sessionData } = data;
  
    const jsonKeys = flattenJSON(sessionData);
  
    const flattenedData = jsonKeys.map((a:any) => ({
      id: uuid(),
      websiteId,
      sessionId,
      dataKey: a.key,
      stringValue: getStringValue(a.value, a.dataType),
      numberValue: a.dataType === DATA_TYPE.number ? a.value : null,
      dateValue: a.dataType === DATA_TYPE.date ? new Date(a.value) : null,
      dataType: a.dataType,
    }));
    
    const existing = await prisma.sessionData.findMany({
      where: {
        sessionId,
      },
      select: {
        id: true,
        sessionId: true,
        dataKey: true,
      },
    });
  
    for (const data of flattenedData) {
      const { sessionId, dataKey, ...props } = data;
      const record = existing.find(e => e.sessionId === sessionId && e.dataKey === dataKey);
  
      if (record) {
        await prisma.sessionData.update({
          where: {
            id: record.id,
          },
          data: {
            ...props,
          },
        });
      } else {
        await prisma.sessionData.create({
          data,
        });
      }
    }
  
    return flattenedData;
  }