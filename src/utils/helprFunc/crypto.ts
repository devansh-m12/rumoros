import { createHash } from 'crypto';
import { startOfHour, startOfMonth } from 'date-fns';
import { v4, v5 } from 'uuid';
import jwt from 'jsonwebtoken';
export function secret() {
  const secretKey = process.env.APP_SECRET || process.env.DATABASE_URL || 'fallback-secret';
  return createHash('sha256').update(secretKey).digest('hex');
}

export function salt() {
  const ROTATING_SALT = createHash('sha256')
    .update(startOfMonth(new Date()).toUTCString())
    .digest('hex');

  return createHash('sha256').update(secret() + ROTATING_SALT).digest('hex');
}

export function visitSalt() {
  const ROTATING_SALT = createHash('sha256')
    .update(startOfHour(new Date()).toUTCString())
    .digest('hex');

  return createHash('sha256').update(secret() + ROTATING_SALT).digest('hex');
}

export function uuid(...args: string[]) {
  if (!args.length) return v4();

  const hashInput = args.join('') + salt();
  return v5(createHash('sha256').update(hashInput).digest('hex'), v5.DNS);
}

export function createToken(session: any, secret: string) {
  return jwt.sign({ session }, secret, { expiresIn: '1h' });
}