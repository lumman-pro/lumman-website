"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
  onPageChange?: (page: number) => void
}

export function Pagination({ totalPages, currentPage, basePath, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(1)

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the start or end
      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always include last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const renderPageLink = (pageNumber: number, label?: string) => {
    const isCurrentPage = pageNumber === currentPage
    const isEllipsis = pageNumber < 0

    if (isEllipsis) {
      return (
        <span key={`ellipsis-${pageNumber}`} className="px-3 py-2 text-muted-foreground">
          ...
        </span>
      )
    }

    if (onPageChange) {
      // Client-side pagination
      return (
        <Button
          key={pageNumber}
          variant={isCurrentPage ? "default" : "outline"}
          size="sm"
          className={cn("h-9 w-9", isCurrentPage && "pointer-events-none")}
          onClick={() => onPageChange(pageNumber)}
          aria-current={isCurrentPage ? "page" : undefined}
        >
          {label || pageNumber}
        </Button>
      )
    } else {
      // Server-side pagination
      return (
        <Link
          key={pageNumber}
          href={`${basePath}${pageNumber > 1 ? `?page=${pageNumber}` : ""}`}
          aria-current={isCurrentPage ? "page" : undefined}
        >
          <Button
            variant={isCurrentPage ? "default" : "outline"}
            size="sm"
            className={cn("h-9 w-9", isCurrentPage && "pointer-events-none")}
          >
            {label || pageNumber}
          </Button>
        </Link>
      )
    }
  }

  return (
    <nav className="flex justify-center" aria-label="Pagination">
      <div className="flex items-center space-x-2">
        {/* Previous page */}
        {currentPage > 1 ? (
          onPageChange ? (
            <Button variant="outline" size="sm" className="h-9 px-4" onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </Button>
          ) : (
            <Link href={`${basePath}${currentPage > 2 ? `?page=${currentPage - 1}` : ""}`}>
              <Button variant="outline" size="sm" className="h-9 px-4">
                Previous
              </Button>
            </Link>
          )
        ) : (
          <Button variant="outline" size="sm" className="h-9 px-4" disabled>
            Previous
          </Button>
        )}

        {/* Page numbers */}
        <div className="flex items-center">{pageNumbers.map((pageNumber) => renderPageLink(pageNumber))}</div>

        {/* Next page */}
        {currentPage < totalPages ? (
          onPageChange ? (
            <Button variant="outline" size="sm" className="h-9 px-4" onClick={() => onPageChange(currentPage + 1)}>
              Next
            </Button>
          ) : (
            <Link href={`${basePath}?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm" className="h-9 px-4">
                Next
              </Button>
            </Link>
          )
        ) : (
          <Button variant="outline" size="sm" className="h-9 px-4" disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  )
}
