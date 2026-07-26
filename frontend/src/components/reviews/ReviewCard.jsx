import StarRating from "./StarRating";

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function ReviewCard({ review }) {
  const initial = (review.username || "?").charAt(0).toUpperCase();

  return (
    <div className="card flex flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet/40">
      <div className="flex items-center gap-3">
        {review.avatar_url ? (
          <img src={review.avatar_url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet font-display text-sm font-bold text-ink">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-paper">{review.username}</p>
          <span className="font-mono text-[11px] text-paper-muted">{formatDate(review.created_at)}</span>
        </div>
      </div>

      <StarRating value={review.rating} readOnly size={14} />

      <p className="text-sm leading-relaxed text-paper/90">{review.review}</p>
    </div>
  );
}
