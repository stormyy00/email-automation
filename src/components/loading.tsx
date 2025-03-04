import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="text-3xl font-bold bg-gradient-to-br from-orange-300 to-orange-900 bg-clip-text text-transparent">
        Loading
      </p>
      <LoaderCircle className="animate-spin bg-gradient-to-br from-orange-300 to-orange-900 bg-clip-text text-transparent" />
    </div>
  );
};

export default Loading;
