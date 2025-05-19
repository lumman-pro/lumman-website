import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/insights"

interface CategoryListProps {
  categories: Category[]
  currentCategory?: string | null
}

export function CategoryList({ categories, currentCategory }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Link
        href="/insights"
        className={cn(
          "text-sm transition-colors duration-300 ease-in-out",
          !currentCategory ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/insights/category/${category.slug}`}
          className={cn(
            "text-sm transition-colors duration-300 ease-in-out",
            currentCategory === category.slug
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
