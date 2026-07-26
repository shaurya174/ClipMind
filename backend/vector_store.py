import json
import os

import faiss
import numpy as np


VECTOR_DIR = "vector_store"

os.makedirs(VECTOR_DIR, exist_ok=True)


def _index_path(video_id: str) -> str:
    return os.path.join(VECTOR_DIR, f"{video_id}.index")


def _metadata_path(video_id: str) -> str:
    return os.path.join(VECTOR_DIR, f"{video_id}_metadata.json")


def create_index(
    embeddings: np.ndarray,
    metadata: list,
    video_id: str,
) -> None:
    """
    Create and save a FAISS index for one video.

    Parameters
    ----------
    embeddings:
        numpy array of shape (N, embedding_dimension)

    metadata:
        List containing transcript chunk metadata.

    video_id:
        YouTube video id.
    """

    if len(embeddings) == 0:
        raise ValueError("Embeddings cannot be empty.")

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(dimension)

    index.add(embeddings)

    faiss.write_index(index, _index_path(video_id))

    with open(_metadata_path(video_id), "w", encoding="utf-8") as file:
        json.dump(
            metadata,
            file,
            indent=2,
            ensure_ascii=False,
        )


def load_index(video_id: str):
    """
    Load FAISS index and metadata.

    Returns
    -------
    (index, metadata)

    or

    (None, None)
    """

    index_file = _index_path(video_id)
    metadata_file = _metadata_path(video_id)

    if not os.path.exists(index_file):
        return None, None

    if not os.path.exists(metadata_file):
        return None, None

    index = faiss.read_index(index_file)

    with open(metadata_file, "r", encoding="utf-8") as file:
        metadata = json.load(file)

    return index, metadata


def search_index(
    index,
    metadata: list,
    query_embedding: np.ndarray,
    top_k: int = 5,
) -> list:
    """
    Search the FAISS index.

    Returns the top-k transcript chunks with similarity scores.
    """

    if query_embedding.ndim == 1:
        query_embedding = query_embedding.reshape(1, -1)

    scores, indices = index.search(query_embedding, top_k)

    results = []

    for score, idx in zip(scores[0], indices[0]):

        if idx == -1:
            continue

        item = metadata[idx].copy()

        item["score"] = float(score)

        results.append(item)

    return results


def index_exists(video_id: str) -> bool:
    """
    Returns True if both the FAISS index and metadata exist.
    """

    return (
        os.path.exists(_index_path(video_id))
        and os.path.exists(_metadata_path(video_id))
    )