import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="text-3xl font-bold bg-gradient-to-br from-orange-300 to-orange-900 bg-clip-text text-transparent">
        Loading
      </p>
      <svg
        className="w-6 h-6 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#gradient)"
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
        </defs>
        <LoaderCircle stroke="url(#gradient)" />
      </svg>
    </div>
  );
};

export default Loading;
