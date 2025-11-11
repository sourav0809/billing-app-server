import Joi from 'joi';

/**
 * User Validations
 * Comprehensive validation schemas for user CRUD operations
 */

// Enum values for validation
const roleValues = ['STUDENT', 'TEACHER', 'ADMIN'];

/**
 * Validation for getting a single user
 */
export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required()
  })
};

/**
 * Validation for getting all users with pagination and filtering
 */
export const getUsers = {
  query: Joi.object().keys({
    email: Joi.string().email(),
    instituteId: Joi.string().uuid(),
    name: Joi.string().min(1).max(255),
    page: Joi.number().integer().min(0).default(0),
    role: Joi.string().valid(...roleValues),
    search: Joi.string().min(1).max(255),
    size: Joi.number().integer().min(1).max(100).default(10)
  })
};

/**
 * Validation for creating a new user
 */
export const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    instituteId: Joi.string().uuid().allow(null),
    name: Joi.string().min(1).max(255).required(),
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .allow(null)
      .allow(''),
    role: Joi.string()
      .valid(...roleValues)
      .optional()
  })
};

/**
 * Validation for updating an existing user
 */
export const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string().min(1).max(255),
      phoneNumber: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .allow(null)
        .allow('')
    })
    .min(1), // At least one field must be provided
  params: Joi.object().keys({
    userId: Joi.string().uuid().required()
  })
};

/**
 * Validation for deleting a user
 */
export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required()
  })
};

/**
 * Validation for getting teachers list
 */
export const getTeachers = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).max(100).default(10)
  })
};
