import { Prisma, Website } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createWebsite(
    data: Prisma.WebsiteCreateInput | Prisma.WebsiteUncheckedCreateInput,
  ): Promise<Website> {
    return prisma.website.create({
      data,
    });
  }

async function findWebsite(criteria: Prisma.WebsiteFindUniqueArgs): Promise<Website | null> {
    return prisma.website.findUnique(criteria);
  }

  export async function getWebsite(websiteId: string) {
    return findWebsite({
      where: {
        id: websiteId,
      },
    });
  }