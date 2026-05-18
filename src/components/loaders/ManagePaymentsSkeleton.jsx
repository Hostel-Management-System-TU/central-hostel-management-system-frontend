// components/loaders/ManagePaymentsSkeleton.jsx

import Skeleton from "./Skeleton";

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-12 h-4" />
    </div>

    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-3 w-24 mb-4" />

    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-4 h-4" />
    </div>

    <Skeleton className="h-8 w-28 mb-2" />
    <Skeleton className="h-3 w-24 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
);

const ManagePaymentsSkeleton = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-11 w-48 rounded-xl" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <Skeleton className="h-6 w-56 mb-6" />

            <div className="flex items-end justify-between h-56 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className={`w-full max-w-[40px] rounded-lg ${
                    i % 2 === 0 ? "h-40" : "h-52"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <Skeleton className="h-6 w-44 mb-5" />

            <div className="flex justify-center mb-5">
              <Skeleton className="w-40 h-40 rounded-full" />
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ManagePaymentsSkeleton;