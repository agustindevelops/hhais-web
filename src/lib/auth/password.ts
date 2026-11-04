import { compare, hash } from "bcryptjs";

const BCRYPT_ROUNDS = 12;

/** bcrypt hash with salt embedded in the returned string. */
export function hashPassword(plain: string) {
  return hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, passwordHash: string) {
  return compare(plain, passwordHash);
}
