"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Error = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="text-5xl font-bold bg-gradient-to-br from-orange-300 to-orange-900 bg-clip-text text-transparent">
        404
      </p>
      <p className="mt-1 text-2xl font-bold">Page does not Exist</p>
      <Button
        onClick={() => router.back()}
        className="mt-4 px-6 py-3 text-lg font-medium bg-black/80 text-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Go Back
      </Button>
    </div>
  );
};

export default Error;
