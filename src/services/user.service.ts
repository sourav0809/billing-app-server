import { Prisma } from '@prisma/client';

import { prisma, PrismaTypes } from '../config/prisma';
import ApiError from '../utils/ApiError';

/**
 * User Service
 * Handles all CRUD operations for User entity with transaction support
 */
class UserService {
  /**
   * Create a new user
   * @param data - User creation data
   * @param tx - Optional transaction client
   * @returns Created user
   */
  async create(data: PrismaTypes.UserCreateInput, client: Prisma.TransactionClient = prisma) {
    try {
      return await client.user.create({
        data,
        select: {
          email: true,
          id: true,
          instituteId: true,
          name: true,
          phoneNumber: true,
          role: true
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Email already exists');
      }
      throw new ApiError(500, `Failed to create user: ${error.message}`);
    }
  }

  /**
   * Delete a user
   * @param id - User ID
   * @param tx - Optional transaction client
   * @returns Deleted user
   */
  async delete(id: string, client: Prisma.TransactionClient = prisma) {
    try {
      return await client.user.delete({
        include: {
          studentProfile: true,
          teacherProfile: true
        },
        where: { id }
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'User not found');
      }
      throw new ApiError(500, `Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Find users with pagination and filtering
   * @param condition - Where condition
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @param tx - Optional transaction client
   * @returns Users with pagination info
   */
  async find(
    condition: PrismaTypes.UserWhereInput = {},
    page: number = 0,
    size: number = 10,
    client: Prisma.TransactionClient = prisma
  ) {
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(size) || size < 1) size = 10;

    const offset = page * size;

    const [users, total] = await Promise.all([
      client.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          email: true,
          id: true,
          name: true,
          phoneNumber: true,
          role: true
        },
        skip: offset,
        take: size,
        where: condition
      }),
      client.user.count({ where: condition })
    ]);

    return {
      data: users,
      pagination: {
        hasMore: offset + size < total,
        page,
        size,
        total
      }
    };
  }

  /**
   * Find a single user by ID or other conditions
   * @param where - Where condition to find the user
   * @param tx - Optional transaction client
   * @returns User with related data
   */
  async findOne(
    where: PrismaTypes.UserWhereUniqueInput,
    client: Prisma.TransactionClient = prisma
  ) {
    try {
      const user = await client.user.findUnique({
        select: {
          email: true,
          id: true,
          instituteId: true,
          name: true,
          password: true,
          phoneNumber: true,
          role: true
        },
        where
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      return user;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to find user: ${error.message}`);
    }
  }

  /**
   * Find all teachers with basic info (id, code, userId)
   * @param tx - Optional transaction client
   * @returns Teachers with basic info
   */
  async findTeachers(client: Prisma.TransactionClient = prisma) {
    try {
      const teachers = await client.user.findMany({
        include: {
          teacherProfile: true
        },
        orderBy: { createdAt: 'desc' },
        where: {
          role: 'TEACHER'
        }
      });

      // Map to return only id, code (registrationNumber), and userId
      const teacherData = teachers
        .map((teacher: any) => ({
          code: teacher.teacherProfile?.registrationNumber,
          id: teacher.teacherProfile?.id,
          userId: teacher.id
        }))
        .filter((teacher: any) => teacher.id); // Filter out any teachers without profiles

      return teacherData;
    } catch (error: any) {
      throw new ApiError(500, `Failed to find teachers: ${error.message}`);
    }
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - User update data
   * @param tx - Optional transaction client
   * @returns Updated user
   */
  async update(
    id: string,
    data: PrismaTypes.UserUpdateInput,
    client: Prisma.TransactionClient = prisma
  ) {
    try {
      return await client.user.update({
        data,
        select: {
          email: true,
          id: true,
          instituteId: true,
          name: true,
          phoneNumber: true,
          role: true
        },
        where: { id }
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'User not found');
      }
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Email already exists');
      }
      throw new ApiError(500, `Failed to update user: ${error.message}`);
    }
  }
}

export default new UserService();
