import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => navigate('/' + nextUrl), 5000);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] gap-7">

      {/* Spinner stack */}
      <div className="relative w-16 h-16">

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 animate-spin" />

        {/* Mid ring — slower */}
        <div
          className="absolute rounded-full border-2 border-transparent border-b-gray-400 animate-spin"
          style={{ inset: '10px', animationDuration: '1.5s', animationDirection: 'reverse' }}
        />

        {/* Inner ring — slowest */}
        <div
          className="absolute rounded-full border-2 border-transparent border-t-gray-300 animate-spin"
          style={{ inset: '20px', animationDuration: '2s' }}
        />

        {/* Center dot */}
        <div className="absolute rounded-full bg-gray-900 animate-pulse"
          style={{ inset: '29px', width: '6px', height: '6px' }}
        />
      </div>

      {/* Label + shimmer dots */}
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          Loading
        </span>
        <div className="flex gap-1.5 items-center">
          {[0, 200, 400].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Loading;