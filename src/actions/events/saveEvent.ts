import { EVENT_NAME_LENGTH, EVENT_TYPE, PAGE_TITLE_LENGTH } from "@/lib/constants";

import { URL_LENGTH } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { uuid } from "@/utils/helprFunc/crypto";
import { saveEventData } from "./saveEventData";

export async function saveEvent(data: {
    websiteId: string;
    sessionId: string;
    visitId: string;
    urlPath: string;
    urlQuery?: string;
    referrerPath?: string;
    referrerQuery?: string;
    referrerDomain?: string;
    pageTitle?: string;
    eventName?: string;
    eventData?: any;
    tag?: string;
  }) {
    const {
      websiteId,
      sessionId,
      visitId,
      urlPath,
      urlQuery,
      referrerPath,
      referrerQuery,
      referrerDomain,
      eventName,
      eventData,
      pageTitle,
      tag,
    } = data;
    const websiteEventId = uuid();
    // console.log("data",data);
    // console.log({
    //     id: websiteEventId,
    //     websiteId,
    //     sessionId,
    //     visitId,
    //     urlPath: urlPath?.substring(0, URL_LENGTH),
    //     urlQuery: urlQuery?.substring(0, URL_LENGTH),
    //     referrerPath: referrerPath?.substring(0, URL_LENGTH),
    //     referrerQuery: referrerQuery?.substring(0, URL_LENGTH),
    //     referrerDomain: referrerDomain?.substring(0, URL_LENGTH),
    //     pageTitle: pageTitle?.substring(0, PAGE_TITLE_LENGTH),
    //     eventType: eventName ? EVENT_TYPE.customEvent : EVENT_TYPE.pageView,
    //     eventName: eventName ? eventName?.substring(0, EVENT_NAME_LENGTH) : null,
    //     tag,
    //   });
    // return;
  
    const websiteEvent = await prisma.websiteEvent.create({
      data: {
        id: websiteEventId,
        websiteId,
        sessionId,
        visitId,
        urlPath: urlPath?.substring(0, URL_LENGTH),
        urlQuery: urlQuery?.substring(0, URL_LENGTH),
        referrerPath: referrerPath?.substring(0, URL_LENGTH),
        referrerQuery: referrerQuery?.substring(0, URL_LENGTH),
        referrerDomain: referrerDomain?.substring(0, URL_LENGTH),
        pageTitle: pageTitle?.substring(0, PAGE_TITLE_LENGTH),
        eventType: eventName ? EVENT_TYPE.customEvent : EVENT_TYPE.pageView,
        eventName: eventName ? eventName?.substring(0, EVENT_NAME_LENGTH) : null,
        tag,
      },
    });
  
    if (eventData) {
      await saveEventData({
        websiteId,
        eventId: websiteEventId,
        eventData,
      });
    }
  
    return websiteEvent;
  }