import os
from faster_whisper import WhisperModel
import json
from datetime import datetime

# Load model once (IMPORTANT: performance improvement)
model = WhisperModel("base", device="cpu", compute_type="float32")


def transcribe_audio(file_path: str) -> dict:
    """
    Transcribes audio into structured time-aware segments.
    
    Returns:
        {
            "text": full transcript string,
            "segments": [
                {
                    "start": float,
                    "end": float,
                    "text": str
                }
            ]
        }
    """

    # 1. Validate file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found at: {file_path}")

    print(f"Processing audio: {os.path.basename(file_path)}")

    # 2. Run transcription (keeps timestamps)
    segments, info = model.transcribe(file_path, beam_size=5)

    # 3. Build structured segment list
    segment_list = []
    full_text_parts = []

    for segment in segments:
        cleaned_text = segment.text.strip()

        segment_list.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": cleaned_text
        })

        full_text_parts.append(cleaned_text)

    # 4. Build final outputs
    full_text = " ".join(full_text_parts).strip()

    return {
        "text": full_text,
        "segments": segment_list
    }

def save_transcript(
    transcript_data: dict,
    video_id: str,
    title: str,
    duration: str,
    output_dir: str = "transcripts"
) -> str:
    """
    Save transcript and video metadata using video_id as the single source of truth.

    Stored information:
    - video_id
    - title
    - duration
    - created_at
    - transcript
    """

    os.makedirs(output_dir, exist_ok=True)

    file_path = os.path.join(output_dir, f"{video_id}.json")

    payload = {
        "video_id": video_id,
        "title": title,
        "duration": duration,
        "created_at": datetime.now().isoformat(),
        "transcript": transcript_data
    }

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    return file_path

def load_transcript(video_id: str, output_dir: str = "transcripts") -> dict | None:
    """
    Load cached transcript and metadata.

    Returns:
        {
            "video_id": ...,
            "title": ...,
            "duration": ...,
            "created_at": ...,
            "transcript": ...
        }

        or None if not found.
    """

    file_path = os.path.join(output_dir, f"{video_id}.json")

    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)