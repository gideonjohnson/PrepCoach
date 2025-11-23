import Header from '../components/Header';
import { SkeletonDashboard, Skeleton } from '../components/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Dashboard Content Skeleton */}
        <SkeletonDashboard />
      </div>
    </div>
  );
}
