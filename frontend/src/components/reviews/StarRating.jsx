import { useState } from "react";

/**
 * Reusable star rating.
 * - readOnly: renders a static rating (review cards, average rating badge).
 * - interactive: click-to-set with hover preview (the review modal).
 */
export default function StarRating({ value, onChange, readOnly = false, size = 18 }) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = !readOnly && hoverValue > 0 ? hoverValue : value;

  return (
    <div
      className={`flex items-center gap-0.5 ${readOnly ? "" : "cursor-pointer"}`}
      onMouseLeave={() => setHoverValue(0)}
      role={readOnly ? undefined : "radiogroup"}
      aria-label={readOnly ? `Rated ${value} out of 5` : "Rating"}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onClick={() => !readOnly && onChange?.(star)}
            aria-label={readOnly ? undefined : `Rate ${star} star${star > 1 ? "s" : ""}`}
            className={`transition-transform duration-150 ${readOnly ? "cursor-default" : "hover:scale-110"}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#FF8B6B" : "none"}
              stroke={filled ? "#FF8B6B" : "#524d63"}
              strokeWidth="1.5"
              className="transition-colors duration-150"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
