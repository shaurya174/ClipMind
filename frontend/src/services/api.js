import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokenStore";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------------------------- */
/* Auth interceptors                                                          */
/* -------------------------------------------------------------------------- */

// Attach the current access token to every outgoing request, when present.
client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Concurrent 401s should trigger exactly one refresh call, not one per
// failed request — every caller awaits the same in-flight promise.
let refreshPromise = null;

function performTokenRefresh() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available."));
  }

  refreshPromise = client
    .post(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { _isRefreshCall: true }, // marks this call so the response interceptor never retries *it*
    )
    .then((res) => {
      setTokens(res.data);
      return res.data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._isRefreshCall &&
      !originalRequest._skipRefresh;
    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await performTokenRefresh();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
      return client(originalRequest);
    } catch (refreshError) {
      clearTokens();
      // Interceptors run outside React's tree, so state cleanup is handled
      // via this event — AuthContext listens for it and clears its user
      // state without needing a hard page reload.
      window.dispatchEvent(new CustomEvent("clipmind:auth-expired"));
      return Promise.reject(refreshError);
    }
  },
);

function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong talking to the server.";
      throw new Error(message);
    });
}

/* -------------------------------------------------------------------------- */
/* Video summarization / chat / mind map / transcript                        */
/* -------------------------------------------------------------------------- */

/**
 * Kick off a new summarization job.
 * @param {string} url - YouTube video URL
 * @returns {Promise<{job_id: string, status: string}>}
 */
export function createSummaryJob(url) {
  return unwrap(client.post("/summarize", { url }));
}

/**
 * Poll the status of a job.
 * @param {string} jobId
 * @returns {Promise<{job_id: string, status: "queued"|"processing"|"done"|"failed"}>}
 */
export function getJobStatus(jobId) {
  return unwrap(client.get(`/status/${jobId}`));
}

/**
 * Fetch the completed result for a job.
 * @param {string} jobId
 * @returns {Promise<object>}
 */
export function getJobResult(jobId) {
  return unwrap(client.get(`/result/${jobId}`));
}

/**
 * Ask a RAG-powered question about a specific video's transcript.
 * @param {{video_id: string, question: string}} payload
 * @returns {Promise<{answer: string, used_transcript: boolean, related_topic: boolean, sources: Array<{start_time: string, end_time: string}>}>}
 */

export function chatWithVideo({ video_id, question }) {
  return unwrap(
    client.post(
      "/chat",
      { video_id, question },
      {
        timeout: 45000,
        _skipRefresh: true,
      },
    ),
  );
}
/**
 * Fetch the AI-generated concept graph for a video.
 * @param {string} videoId
 * @returns {Promise<{root: string, nodes: Array<object>}>}
 */
export function getMindMap(videoId) {
  return unwrap(client.get(`/mindmap/${videoId}`, { timeout: 30000 }));
}

/**
 * Fetch the full timestamped transcript for a video.
 * @param {string} videoId
 * @returns {Promise<{video_id: string, title: string, duration: string, text: string, segments: Array<object>}>}
 */
export function getTranscript(videoId) {
  return unwrap(client.get(`/transcript/${videoId}`, { timeout: 30000 }));
}

/* -------------------------------------------------------------------------- */
/* Reviews                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the public review feed. No auth required.
 * @returns {Promise<{average_rating: number, total_reviews: number, reviews: Array<{id: string, username: string, avatar_url: string|null, rating: number, review: string, created_at: string}>}>}
 */
export function getReviews() {
  return unwrap(client.get("/reviews"));
}

/**
 * Fetch the current user's own review, if any. Requires auth.
 * @returns {Promise<{rating: number, review: string} | null>}
 */
export function getMyReview() {
  return unwrap(client.get("/reviews/me"));
}

/**
 * Create or update the current user's review (the backend handles the
 * upsert — there's no separate PUT endpoint). Requires auth.
 * @param {{rating: number, review: string}} payload
 * @returns {Promise<{message: string}>}
 */
export function submitReview(payload) {
  return unwrap(client.post("/reviews", payload));
}

/**
 * Fetch the current user's recent summarization history. Requires auth.
 * @returns {Promise<{items: Array<{youtube_video_id: string, title: string, duration: string, thumbnail_url: string, summarized_at: string}>}>}
 */
export function getSummaryHistory() {
  return unwrap(client.get("/auth/summary-history"));
}

export { API_BASE, client, unwrap };
