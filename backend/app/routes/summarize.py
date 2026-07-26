from fastapi import APIRouter
from fastapi import Depends
from app.models import SummarizeRequest
from app.auth.dependencies import get_current_user

from app.services.job_manager import create_job, get_job
from app.services.worker import run_job
from threading import Thread

router = APIRouter()


@router.post("/summarize")
def summarize(
    req: SummarizeRequest,
    user=Depends(get_current_user),
):
    job_id = create_job(user_id=user.id)

    # run pipeline in background thread
    thread = Thread(target=run_job, args=(job_id, req.url, user.id))
    thread.start()

    return {
        "job_id": job_id,
        "status": "queued"
    }