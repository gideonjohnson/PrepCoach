import Header from '../components/Header';
import { SkeletonPricing, Skeleton } from '../components/Skeleton';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-32 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Pricing Cards Skeleton */}
        <SkeletonPricing />
      </div>
    </div>
  );
}
