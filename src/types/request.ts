import { HOSTNAME_REGEX, IP_REGEX, COLLECTION_TYPE } from "@/lib/constants";
import { NextRequest } from "next/server";
import * as yup from "yup";
type ObjectValues<T> = T[keyof T];

export type CollectionType = ObjectValues<typeof COLLECTION_TYPE>;

export interface YupRequest {
    GET?: yup.ObjectSchema<any>;
    POST?: yup.ObjectSchema<any>;
    PUT?: yup.ObjectSchema<any>;
    DELETE?: yup.ObjectSchema<any>;
}

export interface TrackRequest {
    payload: {
      website: string;
      data?: { [key: string]: any };
      hostname?: string;
      ip?: string;
      language?: string;
      name?: string;
      referrer?: string;
      screen?: string;
      tag?: string;
      title?: string;
      url: string;
    };
    type: CollectionType;
}

export interface NextRequestTrack extends Omit<NextRequest, 'body' | 'headers'> {
    session: {
      id: string;
      websiteId: string;
      visitId: string;
      hostname: string;
      browser: string;
      os: string;
      device: string;
      screen: string;
      language: string;
      country: string;
      subdivision1: string;
      subdivision2: string;
      city: string;
      iat: number;
    };
    headers: { [key: string]: string };
    yup: YupRequest;
}

const schema = {
    POST: yup.object().shape({
      payload: yup.object().shape({
        data: yup.object(),
        hostname: yup.string().matches(HOSTNAME_REGEX).max(100),
        ip: yup.string().matches(IP_REGEX),
        language: yup.string().max(35),
        referrer: yup.string(),
        screen: yup.string().max(11),
        title: yup.string(),
        url: yup.string(),
        website: yup.string().uuid().required(),
        name: yup.string().max(50),
        tag: yup.string().max(50).nullable(),
      })
        .required(),
      type: yup
        .string()
        .matches(/event|identify/i)
        .required(),
    }),
};