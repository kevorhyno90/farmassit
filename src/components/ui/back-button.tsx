"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "./button"

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      className={className}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Go back</span>
    </Button>
  )
}
