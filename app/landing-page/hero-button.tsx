"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { GoogleAuthButton } from "./google-auth-button"

export function HeroButton() {
  const session = useSession()

  if (session.data?.user) {
    return (
      <Button asChild>
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