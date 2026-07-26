from fastapi import APIRouter
from fastapi import Depends, HTTPException
import json
import os

from app.services.job_manager import get_job
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/result/{job_id}")
def result(job_id: str, user=Depends(get_current_user)):
    job = get_job(job_id, user_id=user.id)

    if job is None:
        raise HTTPException(status_code=404, detail="job not found")

    if job["status"] != "done":
        return {
            "status": job["status"],
            "message": "result not ready yet"
        }

    output_path = job["output_path"]

    if not output_path:
        raise HTTPException(status_code=500, detail="output path missing")

    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="output file missing")

    with open(output_path, "r", encoding="utf-8") as f:
        return json.load(f)