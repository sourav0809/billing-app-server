import Joi from 'joi';

export interface JoiValidationSchema {
  body?: Joi.ObjectSchema;
  files?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}


