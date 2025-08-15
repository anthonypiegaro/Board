import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <Skeleton className="h-12 w-75 rounded-md mb-4" />
      <div className="flex flex-nowrap items-start gap-x-4">
        <Skeleton
          className="w-75 h-150 rounded-md shrink-0"
        />
        <Skeleton
          className="w-75 h-100 rounded-md shrink-0"
        />
        <Skeleton
          className="w-75 h-120 rounded-md shrink-0"
        />
        <Skeleton
          className="w-75 h-50 rounded-md shrink-0"
        />
        <Skeleton
          className="w-75 h-120 rounded-md shrink-0"
        />
        <Skeleton className="w-75 h-14 rounded-md shrink-0" />
      </div>
    </div>
  )
}