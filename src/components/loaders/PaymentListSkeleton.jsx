// components/loaders/PaymentListSkeleton.jsx

import Skeleton from "./Skeleton";

const PaymentListSkeleton = () => {
  return (
    <div className="space-y-5 max-w-[1400px] mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />

        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />

              <div>
                <Skeleton className="h-6 w-12 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-11 w-40 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>

        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>

        <div className="divide-y divide-slate-100">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-7 gap-4 px-4 py-4 items-center"
            >
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentListSkeleton;