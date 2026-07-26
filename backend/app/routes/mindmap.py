from fastapi import APIRouter
from fastapi import Depends, HTTPException

from mindmap_manager import load_mindmap
from database import get_db
from app.auth.dependencies import get_current_user
from app.auth.repository import user_has_video_access

router = APIRouter()


@router.get("/mindmap/{video_id}")
def get_mindmap(video_id: str, user=Depends(get_current_user), db=Depends(get_db)):
    """
    Return the generated mind map for a processed video.
    """

    if not user_has_video_access(db, user.id, video_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this mind map.")

    mindmap = load_mindmap(video_id)

    if mindmap is None:
        return {
            "error": "mind map not found"
        }

    return mindmap