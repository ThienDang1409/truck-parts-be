import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Server
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Database
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required',
  }),

  // Auth
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'JWT_SECRET is required for auth',
  }),
  JWT_EXPIRATION: Joi.string().default('24h'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('debug', 'log', 'warn', 'error', 'verbose')
    .default('log'),

  // Cache (optional)
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),

  // API
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),
});
