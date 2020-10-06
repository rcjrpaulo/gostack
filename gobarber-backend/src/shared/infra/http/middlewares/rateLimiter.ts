import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5, // 5 requests
  duration: 1, // per 1 second by IP
});

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await rateLimiter.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
};
