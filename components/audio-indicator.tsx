"use client";

import { cn } from "@/lib/utils";

interface AudioIndicatorProps {
  isActive: boolean;
  className?: string;
}

export function AudioIndicator({ isActive, className }: AudioIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={cn(
            "w-1 bg-current rounded-full transition-all duration-300 ease-in-out",
            isActive ? "animate-sound-wave" : "h-1",
          )}
          style={{
            animationDelay: `${(bar - 1) * 0.2}s`,
            height: isActive ? "0.5rem" : "0.25rem",
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes sound-wave {
          0%,
          100% {
            height: 0.25rem;
          }
          50% {
            height: 0.75rem;
          }
        }
        .animate-sound-wave {
          animation: sound-wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
