/**
 * Entry of the live-visitor Worker. Cloudflare allows only classes and handlers to be exported from here, so everything
 * else (the rules, the constants) lives in ./core.ts, where the tests can import it.
 */
import { handle, purge } from './core.ts';
import type { Env } from './core.ts';

export default {
  fetch: (request: Request, env: Env) => handle(request, env),
  /** the cron trigger (wrangler.toml): deletes the codes of pages that have gone quiet */
  scheduled: (_event: unknown, env: Env) => purge(env, Date.now()),
};
