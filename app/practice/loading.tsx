import Header from '../components/Header';
import { SkeletonPractice, Skeleton } from '../components/Skeleton';

export default function PracticeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-40 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-12 w-72 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-2xl mx-auto mb-8">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-4 justify-center mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Practice Cards Skeleton */}
        <SkeletonPractice />
      </div>
    </div>
  );
}
