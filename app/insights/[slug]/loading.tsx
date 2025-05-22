import { PostSkeleton } from "@/components/insights/post-skeleton";

export default function PostLoading() {
  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <PostSkeleton />
    </div>
  );
}
