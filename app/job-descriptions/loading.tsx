import Header from '../components/Header';
import { Skeleton, SkeletonCard } from '../components/Skeleton';

export default function JobDescriptionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
