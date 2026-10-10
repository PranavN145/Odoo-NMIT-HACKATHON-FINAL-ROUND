import Link from "next/link";
import { SlidersHorizontal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#EAF5FB] border border-[#BDE0FE] text-[#006494] flex items-center justify-center shadow-xs">
        <SlidersHorizontal className="w-7 h-7" />
      </div>
      
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#13293D]">404 — Page Not Found</h1>
        <p className="text-xs text-[#5F7485]">
          The manager portal page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        href="/manage"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Manage Page</span>
      </Link>
    </div>
  );
}
