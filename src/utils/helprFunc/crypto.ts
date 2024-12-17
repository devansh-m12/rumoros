import bcrypt from 'bcrypt';
import { startOfHour, startOfMonth } from 'date-fns';
import { v4, v5 } from 'uuid';
import jwt from 'jsonwebtoken';

export function secret() {
  const secretKey = process.env.APP_SECRET || process.env.DATABASE_URL || 'fallback-secret';
  return bcrypt.hashSync(secretKey, 10);
}

export function salt() {
  const rotatingSalt = bcrypt.hashSync(startOfMonth(new Date()).toUTCString(), 10);
  return bcrypt.hashSync(secret() + rotatingSalt, 10);
}

export function visitSalt() {
  const rotatingSalt = bcrypt.hashSync(startOfHour(new Date()).toUTCString(), 10);
  return bcrypt.hashSync(secret() + rotatingSalt, 10);
}

export function uuid(...args: string[]) {
  if (!args.length) return v4();

  const hashInput = args.join('') + salt();
  return v5(bcrypt.hashSync(hashInput, 10), v5.DNS);
}

export function createToken(session: any, secret: string) {
  return jwt.sign({ session }, secret, { expiresIn: '1h' });
}