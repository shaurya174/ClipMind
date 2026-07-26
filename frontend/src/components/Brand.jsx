import { Link } from "react-router-dom";

export default function Brand({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet">
        <div className="flex gap-[3px]">
          <span className="h-4 w-[3px] rounded-full bg-ink animate-pulseBar [animation-delay:0ms]" />
          <span className="h-4 w-[3px] rounded-full bg-ink animate-pulseBar [animation-delay:150ms]" />
          <span className="h-4 w-[3px] rounded-full bg-ink animate-pulseBar [animation-delay:300ms]" />
        </div>
      </div>
      <span className="font-display text-2xl font-bold uppercase tracking-tight text-paper">
        ClipMind
      </span>
    </Link>
  );
}
