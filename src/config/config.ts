import * as dotenv from 'dotenv';
import Joi from 'joi';

import { SERVER_ENVIRONMENT } from '../constants';

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    BCRYPT_SALT_ROUNDS: Joi.string().optional(),
    MASTER_PASSWORD: Joi.string().required(),
    PORT: Joi.string().required(),
    SECRET_KEY: Joi.string().required(),
    SERVER_ENV: Joi.string()
      .valid(SERVER_ENVIRONMENT.DEVELOPMENT, SERVER_ENVIRONMENT.TEST, SERVER_ENVIRONMENT.PRODUCTION)
      .required()
  })
  .unknown();

const { error, value: envVars } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error && process.env.SERVER_ENV !== SERVER_ENVIRONMENT.DEVELOPMENT) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig = {
  security: {
    bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS || '12',
    masterPassword: envVars.MASTER_PASSWORD,
    secretKey: envVars.SECRET_KEY
  },
  server: {
    env: envVars.SERVER_ENV,
    port: envVars.PORT
  }
};

export default envConfig;
