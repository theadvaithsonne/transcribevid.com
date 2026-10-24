"""Download endpoints use the same visitor/session dependency as transcripts."""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from . import config
from .downloads import DownloadError
from .limits import RateLimiter


class DownloadRequest(BaseModel):
    url: str = Field(min_length=1, max_length=2048)
    quality: Literal[360, 720, 1080] = 720


def create_download_router(get_store):
    router = APIRouter(prefix="/api/downloads", tags=["downloads"])
    limiter = RateLimiter(config.RATE_UPLOADS_PER_HOUR, 3600)
    def call(fn, *args):
        try:
            return fn(*args)
        except DownloadError as exc:
            raise HTTPException(exc.status, str(exc)) from exc

    @router.post("", status_code=201)
    def start(body: DownloadRequest, request: Request, store=Depends(get_store)):
        ip = request.client.host if request.client else "unknown"
        if not limiter.allow(ip):
            raise HTTPException(429, "Too many downloads. Please wait and try again.",
                                headers={"Retry-After": str(limiter.retry_after(ip))})
        return call(store.downloads.create, body.url, body.quality)

    @router.get("")
    def list_downloads(store=Depends(get_store)):
        return store.downloads.list()

    @router.get("/{download_id}")
    def get_download(download_id: str, store=Depends(get_store)):
        return call(store.downloads.snapshot, download_id)

    @router.post("/{download_id}/cancel")
    def cancel(download_id: str, store=Depends(get_store)):
        return call(store.downloads.cancel, download_id)

    @router.delete("/{download_id}", status_code=204)
    def delete(download_id: str, store=Depends(get_store)):
        call(store.downloads.delete, download_id)
        return Response(status_code=204)

    @router.get("/{download_id}/file")
    def file(download_id: str, store=Depends(get_store)):
        path, name = call(store.downloads.file, download_id)
        return FileResponse(path, media_type="video/mp4", filename=name,
                            headers={"Cache-Control": "no-store"})

    return router
