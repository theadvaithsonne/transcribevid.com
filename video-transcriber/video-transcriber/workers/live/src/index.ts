/**
 * Entry of the live-visitor Worker. Cloudflare allows only classes and handlers to be exported from here, so everything
 * else (the rules, the constants) lives in ./core.ts, where the tests can import it.
 */
import { handle, Presence } from './core.ts';
import type { Env } from './core.ts';

export { Presence };

export default {
  fetch: (request: Request, env: Env) => handle(request, env),
};
