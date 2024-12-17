import { Prisma, Website } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uuid } from "@/utils/helprFunc/crypto";

export async function createWebsite(
    data: Prisma.WebsiteCreateInput | Prisma.WebsiteUncheckedCreateInput,
  ): Promise<Website> {
    console.log("data", data);
    return await prisma.website.create({
      data: {
        ...data,
        id: uuid(),
        shareId: uuid(),
      },
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

  export async function getAllWebsites(userId: string) {
    const websites = await prisma.website.findMany({
      where: {
        userId,
      },
    });
    return websites;
  }

  export async function getWebsiteById(websiteId: string) {
    return findWebsite({
      where: {
        id: websiteId,
      },
      select: {
        id: true,
        name: true,
        domain: true,
        shareId: true,
        createdBy: true,
        createdAt: true,
      },
    });
  }