"use client"

import { PhoneAuthForm } from "@/components/auth/phone-auth-form"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function LoginPageClient() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use absolute URLs to ensure the images are found
  const logoSrc = mounted ? (resolvedTheme === "dark" ? "/lumman_white.svg" : "/lumman_black.svg") : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center justify-center mb-8">
          {logoSrc ? (
            <img
              src={logoSrc || "/placeholder.svg"}
              alt="Lumman.ai"
              width={150}
              height={36}
              className="transition-opacity duration-300 ease-in-out"
            />
          ) : (
            <div className="w-[150px] h-[36px]" />
          )}
        </div>
        <PhoneAuthForm />
      </div>
    </div>
  )
}
