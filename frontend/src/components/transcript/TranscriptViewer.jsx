import { useEffect, useMemo, useRef, useState } from "react";
import TranscriptSearch from "./TranscriptSearch";
import TranscriptSegment from "./TranscriptSegment";
import { countMatches } from "../../utils/highlight";

export default function TranscriptViewer({ segments, onTimestampClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const segmentRefs = useRef([]);
  const searchInputRef = useRef(null);

  const term = searchTerm.trim();
  const hasSearchTerm = term.length > 0;

  const matchingSegments = useMemo(() => {
    if (!hasSearchTerm) return segments;
    return segments.filter((seg) => countMatches(seg.text, term) > 0);
  }, [segments, term, hasSearchTerm]);

  const totalMatchCount = useMemo(() => {
    if (!hasSearchTerm) return 0;
    return segments.reduce((sum, seg) => sum + countMatches(seg.text, term), 0);
  }, [segments, term, hasSearchTerm]);

  useEffect(() => {
    segmentRefs.current = segmentRefs.current.slice(0, matchingSegments.length);
  }, [matchingSegments.length]);

  useEffect(() => {
    if (hasSearchTerm && matchingSegments.length > 0) {
      setActiveMatchIndex(0);
      requestAnimationFrame(() => {
        segmentRefs.current[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  function goToMatch(index) {
    setActiveMatchIndex(index);
    segmentRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handlePrev() {
    if (matchingSegments.length === 0) return;
    goToMatch((activeMatchIndex - 1 + matchingSegments.length) % matchingSegments.length);
  }

  function handleNext() {
    if (matchingSegments.length === 0) return;
    goToMatch((activeMatchIndex + 1) % matchingSegments.length);
  }

  const showEmptySearchState = hasSearchTerm && matchingSegments.length === 0;

  return (
    <div className="flex h-full flex-col">
      <TranscriptSearch
        ref={searchInputRef}
        value={searchTerm}
        onChange={setSearchTerm}
        matchCount={totalMatchCount}
        hasSearchTerm={hasSearchTerm}
        currentIndex={activeMatchIndex}
        totalMatches={matchingSegments.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="themed-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {showEmptySearchState ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-ink-border bg-ink-surface px-6 py-14 text-center animate-fadeUp">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-paper-muted">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-paper">No matches</p>
            <p className="max-w-xs text-sm text-paper-muted">No transcript lines match your search.</p>
          </div>
        ) : (
          matchingSegments.map((segment, i) => (
            <TranscriptSegment
              key={`${segment.start}-${i}`}
              ref={(el) => (segmentRefs.current[i] = el)}
              segment={segment}
              searchTerm={term}
              isActiveMatch={hasSearchTerm && i === activeMatchIndex}
              onTimestampClick={onTimestampClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
