"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { GoogleAuthButton } from "../auth/google-auth-button"

export function HeroButton() {
  const session = useSession()

  if (session.data?.user) {
    return (
      <Button className="hover:bg-fuchsia-300 dark:hover:bg-fuchsia-500 hover:text-foreground transition-all" asChild>
        <Link href="/dashboard">
          Dashboard
          <ArrowRight />
        </Link>
      </Button>
    )
  }

  return (
    // <Button className="hover:bg-fuchsia-300 dark:hover:bg-fuchsia-500 hover:text-foreground transition-all" asChild>
    //   <Link href="/auth">
    //     Let's go
    //     <ArrowRight />
    //   </Link>
    // </Button>
    <GoogleAuthButton />
  )
}