/**
 * User Controller
 * Handles user management operations including CRUD operations and user data retrieval
 */

import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import config from '../config/config';
import SUCCESS_MESSAGES from '../constants/success';
import { UserService } from '../services';
import { Pagination, Params } from '../types';
import catchAsync from '../utils/catchAsync';
import { response } from '../utils/response';

/**
 * Get a single user by ID
 */
const getUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as Pick<Params, 'userId'>;

  const user = await UserService.findOne({ id: userId });

  return response(res, httpStatus.OK, SUCCESS_MESSAGES.USER.FETCHED, user);
});

/**
 * Get all users with pagination and filtering
 */
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const {
    email,
    instituteId,
    name,
    page = 0,
    role,
    search,
    size = 10
  } = req.query as unknown as Pagination & {
    email: string;
    instituteId: string;
    name: string;
    role: string;
    search: string;
  };

  const whereCondition: Prisma.UserWhereInput = {};

  if (role) {
    whereCondition.role = role as Role;
  }

  if (email) {
    whereCondition.email = {
      contains: email,
      mode: 'insensitive'
    };
  }

  if (name) {
    whereCondition.name = {
      contains: name,
      mode: 'insensitive'
    };
  }

  if (instituteId) {
    whereCondition.instituteId = instituteId;
  }

  if (search) {
    whereCondition.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        email: {
          contains: search,
          mode: 'insensitive'
        }
      }
    ];
  }

  const result = await UserService.find(whereCondition, page, size);

  return response(res, httpStatus.OK, SUCCESS_MESSAGES.USER.FETCHED, result);
});

/**
 * Create a new user
 */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  if (userData.password) {
    userData.password = await bcrypt.hash(
      userData.password,
      parseInt(config.security.bcryptSaltRounds, 10)
    );
  } else {
    userData.password = await bcrypt.hash(
      'password',
      parseInt(config.security.bcryptSaltRounds, 10)
    );
  }

  const user = await UserService.create(userData);

  return response(res, httpStatus.CREATED, SUCCESS_MESSAGES.USER.CREATED, user);
});

/**
 * Update an existing user
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as Pick<Params, 'userId'>;
  const updateData = req.body;

  const user = await UserService.update(userId!, updateData);

  return response(res, httpStatus.OK, SUCCESS_MESSAGES.USER.UPDATED, user);
});

/**
 * Delete a user
 */
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as Pick<Params, 'userId'>;

  const user = await UserService.delete(userId!);

  const { password: _password, ...userDataResponse } = user;

  return response(res, httpStatus.OK, SUCCESS_MESSAGES.USER.DELETED, userDataResponse);
});

/**
 * Get all teachers
 */
const getTeachers = catchAsync(async (req: Request, res: Response) => {
  const teachers = await UserService.findTeachers();

  return response(res, httpStatus.OK, SUCCESS_MESSAGES.TEACHER.FETCHED, teachers);
});

export default {
  createUser,
  deleteUser,
  getTeachers,
  getUser,
  getUsers,
  updateUser
};
