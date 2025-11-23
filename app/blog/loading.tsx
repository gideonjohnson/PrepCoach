import Header from '../components/Header';
import { SkeletonBlogCard, Skeleton } from '../components/Skeleton';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-40 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonBlogCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
