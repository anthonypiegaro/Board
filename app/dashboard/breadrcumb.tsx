"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SlashIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const path = usePathname()

  const segments = path.split("/").slice(1)
  return (
    <div className="flex items-center gap-x-2 overflow-auto">
      {segments.map((segment, i) => {
        if (segment === "dashboard" && i !== segments.length - 1) {
          return (
            <React.Fragment key={i}>
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-all duration-150">
                dashboard
              </Link>
              <SlashIcon className="shrink-0 h-4 w-4 text-muted-foreground" />
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={i}>
            <p className="text-sm text-muted-foreground whitespace-nowrap">{segment}</p>
            {i !== segments.length - 1 && <SlashIcon className="shrink-0 h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}