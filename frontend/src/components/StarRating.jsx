import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className={readOnly ? 'cursor-default' : 'cursor-pointer'}>
            {!readOnly && (
              <input
                type="radio"
                name="rating"
                className="hidden"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
            )}
            <FaStar
              className={`text-2xl transition-colors ${
                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-slate-600'
              }`}
              onMouseEnter={() => !readOnly && setHover(ratingValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}
