import Link from "next/link"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

export function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-12">
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1
        const isActive = page === currentPage

        return (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}/page/${page}`}
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 text-sm border transition-colors duration-300 ease-in-out",
              isActive
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </Link>
        )
      })}
    </div>
  )
}
