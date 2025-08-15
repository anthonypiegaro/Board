import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full h-full mt-5 mb-25">
      <div className="container mx-auto">
        <div className="w-full px-2 pb-10">
          <div className="w-full flex gap-4 my-10">
            <Skeleton className="h-10 rounded-md grow max-w-lg" />
            <Skeleton className="h-10 w-20 shrink-0" />
          </div>
          <div className="w-full flex flex-col gap-7">
              {[4, 2, 6].map((numberOfCards, i) => (
                <div key={i}>
                  <div className="w-full border-b mb-4 pb-2">
                    <Skeleton className="h-12 w-75" />
                  </div>
                  <div className="flex flex-wrap max-md:flex-nowrap max-md:w-full max-md:max-w-full max-md:overflow-x-scroll gap-4">
                    {[...Array(numberOfCards)].map((_, i) => (
                      <Skeleton key={i} className="shrink-0 w-50 h-50 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}