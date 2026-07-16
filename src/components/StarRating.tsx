import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange: (n: number) => void;
  idPrefix?: string;
}

export function StarRating({ value, onChange, idPrefix = "rating" }: Props) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      id={`${idPrefix}-stars`}
      data-testid={`${idPrefix}-stars`}
      data-value={value}
      role="radiogroup"
      aria-label="Star rating"
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            id={`${idPrefix}-star-${n}`}
            data-testid={`${idPrefix}-star-${n}`}
            data-selected={n <= value}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="rounded p-1 text-amber-500 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star className={`h-6 w-6 ${filled ? "fill-current" : ""}`} />
          </button>
        );
      })}
    </div>
  );
}
