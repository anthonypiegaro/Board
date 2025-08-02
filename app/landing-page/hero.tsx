import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className={cn(
      "relative py-10 lg:py-15 mx-auto max-w-sm sm:max-w-md md:max-w-xl xl:max-w-2xl xl:font-bold animate-[slide-up_2s]",
      "after:absolute after:inset-0 after:backdrop-blur-xl after:animate-[blur-to-sharp_2s_forwards]"
    )}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold px-10 text-center text-slate-900">
        Organize Your Project Management Tasks - by Putting Them on Your{" "}
        <span className="font-extrabold bg-gradient-to-br from-neutral-700 via-neutral-400 to-neutral-700 bg-clip-text text-transparent">
          Board
        </span>
      </h1>
      <div className="w-full flex justify-center mt-5 sm:mt-7">
        <Button className="hover:bg-red-300">
          Let's go
          <ArrowRight />
        </Button>
      </div>
    </section>
  )
}