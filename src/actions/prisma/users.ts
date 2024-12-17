import { ROLES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { GetUserOptions } from "@/types/request";
import { uuid } from "@/utils/helprFunc/crypto";
import { Prisma } from "@prisma/client";

export async function createUser(data: {
    username: string;
    password: string;
    email: string;
  }): Promise<{
    id: string;
    username: string;
    email: string;
  }> {
   try {
    return prisma.user.create({
      data: {
        ...data,
        id: uuid(),
        role: ROLES.user,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
   } catch (error) {
    console.error('Error creating user:', error);
    throw error;
   }
  }

  async function findUser(
    criteria: Prisma.UserFindUniqueArgs,
    options: GetUserOptions = {},
  ): Promise<any> {
    const { includePassword = false, showDeleted = false } = options;
  
    return prisma.user.findUnique({
      ...criteria,
      where: {
        ...criteria.where,
        ...(showDeleted && { deletedAt: null }),
      },
      select: {
        id: true,
        username: true,
        password: includePassword,
        role: true,
        createdAt: true,
      },
    });
  }

  export async function getUser(userId: string, options: GetUserOptions = {}) {
    return findUser(
      {
        where: {
          id: userId,
        },
      },
      options,
    );
  }

  export async function getUserByUsername(username: string, options: GetUserOptions = {}) {
    return findUser({ where: { username } }, options);
  }

  export async function getUserByEmail(email: string, options: GetUserOptions = {}) {
    return findUser({ where: { email } }, options);
  }