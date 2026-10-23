"""Remove session folders left behind by instances that are no longer running:  python -m app.cleanup

The launcher (scripts/run.mjs) calls this after it has stopped the servers, because a server that is
force-killed cannot clean up after itself."""
import logging

from .jobs import JobStore

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    JobStore.purge_stale_sessions()
