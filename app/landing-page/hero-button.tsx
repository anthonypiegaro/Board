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
      <Button className="active:scale-97 active:transition-all active:duration-150" asChild>
        <Link href="/dashboard">
          Dashboard
          <ArrowRight />
        </Link>
      </Button>
    )
  }

  return (
    <GoogleAuthButton />
  )
}