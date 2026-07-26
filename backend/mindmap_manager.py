import json
import os

MINDMAP_DIR = "mindmaps"

os.makedirs(MINDMAP_DIR, exist_ok=True)


def _mindmap_path(video_id: str) -> str:
    """
    Return the JSON path for a video's mind map.
    """
    return os.path.join(MINDMAP_DIR, f"{video_id}.json")


def save_mindmap(
    video_id: str,
    mindmap: dict,
) -> str:
    """
    Save a generated mind map.

    Returns:
        Path to the saved JSON file.
    """

    file_path = _mindmap_path(video_id)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(
            mindmap,
            file,
            indent=2,
            ensure_ascii=False,
        )

    return file_path


def load_mindmap(video_id: str) -> dict | None:
    """
    Load a previously generated mind map.

    Returns:
        Mind map dictionary or None if it doesn't exist.
    """

    file_path = _mindmap_path(video_id)

    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def mindmap_exists(video_id: str) -> bool:
    """
    Returns True if a mind map already exists.
    """

    return os.path.exists(_mindmap_path(video_id))