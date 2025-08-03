import { Skeleton } from '@/components/ui/skeleton';

export const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-[350px]" />
      </div>
    </div>
  );
};

export const PageLoadingFallback = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};