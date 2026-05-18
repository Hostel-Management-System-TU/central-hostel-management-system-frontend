import Skeleton from "./Skeleton";

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" />

    <div className="relative">
      <Skeleton className="w-9 h-9 rounded-xl mb-3" />
      <Skeleton className="h-6 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

const ActionCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-200/70">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />

    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-xl bg-white/40" />
        <Skeleton className="w-4 h-4 rounded" />
      </div>

      <Skeleton className="h-5 w-32 mb-2 bg-white/40" />
      <Skeleton className="h-3 w-24 bg-white/30" />
    </div>
  </div>
);

const PaymentItemSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />

    <div className="flex-1">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>

    <div className="text-right">
      <Skeleton className="h-4 w-16 mb-2 ml-auto" />
      <Skeleton className="h-5 w-20 rounded-full ml-auto" />
    </div>
  </div>
);

const ReportItemSkeleton = () => (
  <div className="p-3 rounded-xl border border-slate-100">
    <div className="flex items-start gap-2.5">
      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

const HomeLoaderSkeliton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>

        <Skeleton className="h-4 w-40" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <ActionCardSkeleton key={i} />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Payments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <PaymentItemSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <Skeleton className="h-6 w-40 mb-5" />

            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <Skeleton className="h-8 w-10 mx-auto mb-2" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <ReportItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoaderSkeliton;