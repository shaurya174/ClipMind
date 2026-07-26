import json
import os
from datetime import datetime


def save_output(
    summary: dict,
    video_id: str,
    title: str,
    duration: str,
    output_dir: str = "outputs"
) -> str:
    """
    Save the generated summary to a timestamped JSON file.

    Filename format:
        <video_id>_<YYYYMMDD_HHMMSS>.json
    """

    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = f"{video_id}_{timestamp}.json"

    file_path = os.path.join(output_dir, filename)

    payload = {
        "video_id": video_id,
        "title": title,
        "duration": duration,
        "generated_at": datetime.now().isoformat(),
        "summary": summary
    }

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    return file_path