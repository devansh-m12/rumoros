import { DESKTOP_OS, DESKTOP_SCREEN_WIDTH, LAPTOP_SCREEN_WIDTH, LOCALHOST, MOBILE_OS, MOBILE_SCREEN_WIDTH } from "@/lib/constants";
import maxmind from 'maxmind';
import { browserName, detectOS } from 'detect-browser';
import path from 'path';

let lookup: any = null;


export function getIpAddress(req: any): string | null {
    // Cloudflare
    const cfIp = req.headers.get?.('cf-connecting-ip') || req.headers['cf-connecting-ip'];
    if (cfIp) return cfIp;

    // X-Forwarded-For
    const forwardedFor = req.headers.get?.('x-forwarded-for') || req.headers['x-forwarded-for'];
    if (forwardedFor) {
        const ipAddresses = forwardedFor.split(',');
        const ipAddress = ipAddresses[0].trim();
        return ipAddress === '::1' ? LOCALHOST : ipAddress;
    }

    // Direct IP
    const directIp = req.ip || req.socket?.remoteAddress;
    return directIp === '::1' ? LOCALHOST : directIp || null;
}


export function getDevice(screen: string | undefined, os: string) {
    console.log("screen", screen);
    console.log("os", os);
    if (!screen) return 'desktop'; // Default to desktop if no screen size

    const [width] = screen.split('x');
    const numWidth = parseInt(width, 10);

    if (DESKTOP_OS.includes(os)) {
        if (os === 'Chrome OS' || numWidth < DESKTOP_SCREEN_WIDTH) {
            return 'laptop';
        }
        return 'desktop';
    } else if (MOBILE_OS.includes(os)) {
        if (os === 'Amazon OS' || numWidth > MOBILE_SCREEN_WIDTH) {
            return 'tablet';
        }
        return 'mobile';
    }
    if (numWidth >= DESKTOP_SCREEN_WIDTH) {
        return 'desktop';
    } else if (numWidth >= LAPTOP_SCREEN_WIDTH) {
        return 'laptop';
    } else if (numWidth >= MOBILE_SCREEN_WIDTH) {
        return 'tablet';
    }
    return 'mobile';
}

function getRegionCode(country: string, region: string) {
    if (!country || !region) {
      return undefined;
    }
  
    return region.includes('-') ? region : `${country}-${region}`;
}
  
function safeDecodeCfHeader(s: string | undefined | null): string | undefined | null {
    if (s === undefined || s === null) {
      return s;
    }
  
    return Buffer.from(s, 'latin1').toString('utf-8');
  }

  export async function getLocation(ip: string, req: any) {
  
    try {
        // Cloudflare headers
        const cfCountry = req.headers.get?.('cf-ipcountry') || req.headers['cf-ipcountry'];
        const cfRegion = req.headers.get?.('cf-region-code') || req.headers['cf-region-code'];
        const cfCity = req.headers.get?.('cf-ipcity') || req.headers['cf-ipcity'];

        if (cfCountry) {
            return {
                country: safeDecodeCfHeader(cfCountry),
                subdivision1: getRegionCode(safeDecodeCfHeader(cfCountry) as string, safeDecodeCfHeader(cfRegion) as string),
                city: safeDecodeCfHeader(cfCity),
            };
        }

        // Vercel headers
        if (req.headers['x-vercel-ip-country']) {
          const country: any = decodeURIComponent(req.headers['x-vercel-ip-country']);
          const subdivision1: any = decodeURIComponent(req.headers['x-vercel-ip-country-region']);
          const city: any = decodeURIComponent(req.headers['x-vercel-ip-city']);
  
          return {
            country,
            subdivision1: getRegionCode(country, subdivision1),
            city,
          };
        }
  
        // Database lookup
        if (!lookup) {
          const dir = path.join(process.cwd(), 'src/geo');
  
          lookup = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
        }
  
        const result = lookup.get(ip);
  
        if (result) {
          const country = result.country?.iso_code ?? result?.registered_country?.iso_code;
          const subdivision1 = result.subdivisions?.[0]?.iso_code;
          const subdivision2 = result.subdivisions?.[1]?.names?.en;
          const city = result.city?.names?.en;
  
          return {
            country,
            subdivision1: getRegionCode(country, subdivision1),
            subdivision2,
            city,
          };
        }
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
  }

  export async function getClientInfo(req: any) {
    try {
        const userAgent = req.headers.get?.('user-agent') || req.headers['user-agent'];
        const ip = req.body?.payload?.ip || getIpAddress(req);
        const location = await getLocation(ip, req);
        const browser = browserName(userAgent);
        const os = detectOS(userAgent) as string;
        const device = getDevice(req.body?.payload?.screen, os);

        return {
            userAgent,
            browser,
            os,
            ip,
            country: location?.country,
            subdivision1: location?.subdivision1,
            subdivision2: location?.subdivision2,
            city: location?.city,
            device,
        };
    } catch (error) {
        console.error('Error getting client info:', error);
        return null;
    }
  }