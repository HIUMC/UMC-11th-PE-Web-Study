import { QueryFailedError } from 'typeorm';
import type { ErrorKey } from './errors.js';

// Never expose sqlMessage (it includes the duplicate value) or query parameters.
export function mysqlConflict(error: unknown): ErrorKey | undefined {
  if (!(error instanceof QueryFailedError)) return undefined;
  const driver = error.driverError as Record<string, unknown>;
  if (
    driver.errno !== 1062 ||
    driver.code !== 'ER_DUP_ENTRY' ||
    typeof driver.sqlMessage !== 'string'
  )
    return undefined;
  const table = /^\s*(?:INSERT\s+INTO|UPDATE)\s+`(member|rating)`/i
    .exec(error.query)?.[1]
    ?.toLowerCase();
  const key = /for key ['`]([^'`]+)['`]/i
    .exec(driver.sqlMessage)?.[1]
    ?.split('.')
    .at(-1);
  if (table === 'member' && key === 'email') return 'emailDuplicate';
  if (table === 'member' && key === 'nickname') return 'nicknameDuplicate';
  if (table === 'rating' && key === 'uk_rating_member_movie')
    return 'ratingDuplicate';
  return undefined;
}
