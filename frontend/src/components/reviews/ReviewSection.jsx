import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyReview, getReviews, submitReview } from "../../services/api";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import StarRating from "./StarRating";

const PREVIEW_COUNT = 5;

function ReviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card animate-pulse p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-ink-surface2" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-ink-surface2" />
              <div className="h-2.5 w-1/3 rounded bg-ink-surface2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2.5 w-full rounded bg-ink-surface2" />
            <div className="h-2.5 w-4/5 rounded bg-ink-surface2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewSection() {
  const { isAuthenticated } = useAuth();

  const [reviewsData, setReviewsData] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  async function loadReviews() {
    try {
      const data = await getReviews();
      setReviewsData(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  async function loadMyReview() {
    if (!isAuthenticated) {
      setMyReview(null);
      return;
    }
    try {
      const mine = await getMyReview();
      setMyReview(mine);
    } catch {
      // Not being able to fetch "my review" shouldn't block the public feed.
      setMyReview(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([loadReviews(), loadMyReview()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(payload) {
    await submitReview(payload);
    await Promise.all([loadReviews(), loadMyReview()]);
    setModalOpen(false);
    setToast(myReview ? "Review updated." : "Thanks for the review!");
  }

  const reviews = reviewsData?.reviews?.slice(0, PREVIEW_COUNT) || [];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="eyebrow">Loved by the people who use it</span>
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-paper sm:text-4xl">
          What people are saying
        </h2>

        {reviewsData && (
          <div className="mt-2 flex items-center gap-3">
            <StarRating value={reviewsData.average_rating} readOnly size={20} />
            <span className="font-mono text-sm text-paper">{reviewsData.average_rating.toFixed(1)} / 5</span>
            <span className="font-mono text-sm text-paper-muted">· {reviewsData.total_reviews} reviews</span>
          </div>
        )}

        <div className="mt-4">
          {isAuthenticated ? (
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              {myReview ? "Edit Your Review" : "Write Review"}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-paper-muted">Sign in to share your experience.</p>
              <Link
                to="/login"
                className="rounded-full border border-ink-border bg-ink-surface px-5 py-2.5 text-sm font-semibold text-paper transition-colors duration-150 hover:border-violet/60 hover:text-violet"
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        {toast && (
          <div className="mt-2 rounded-full bg-teal/15 px-4 py-2 font-mono text-xs text-teal animate-fadeUp">{toast}</div>
        )}
      </div>

      <div className="mt-10">
        {loading && <ReviewSkeleton />}

        {!loading && loadError && (
          <p className="text-center font-mono text-xs text-danger">Couldn't load reviews right now.</p>
        )}

        {!loading && !loadError && reviews.length === 0 && (
          <p className="text-center text-sm text-paper-muted">No reviews yet — be the first to share your experience.</p>
        )}

        {!loading && !loadError && reviews.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        open={modalOpen}
        existingReview={myReview}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
