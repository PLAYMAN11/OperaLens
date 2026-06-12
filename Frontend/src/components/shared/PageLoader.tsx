import { Skeleton } from '@/components/ui/skeleton'

export function PageLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-4 gap-6">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}
