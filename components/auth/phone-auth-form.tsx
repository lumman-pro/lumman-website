"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithPhone, verifyOtp } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function PhoneAuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const submitAttemptRef = useRef(false)

  // Handle OTP expiration timer
  useEffect(() => {
    if (step === "otp" && otpExpiry) {
      const updateTimer = () => {
        const now = Date.now()
        const remaining = Math.max(0, Math.floor((otpExpiry - now) / 1000))

        setTimeRemaining(remaining)

        if (remaining <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          setError("Verification code has expired. Please request a new one.")
        }
      }

      updateTimer()
      timerRef.current = setInterval(updateTimer, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }, [step, otpExpiry])

  // Format time remaining
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return ""
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submission attempts
    if (isLoading || submitAttemptRef.current) return
    submitAttemptRef.current = true

    setError(null)
    setIsLoading(true)

    try {
      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/
      if (!phoneRegex.test(phone)) {
        setError("Please enter a valid phone number including country code (e.g., +1234567890)")
        setIsLoading(false)
        submitAttemptRef.current = false
        return
      }

      const { error } = await signInWithPhone(phone)

      if (error) {
        setError(error.message)
      } else {
        // Set OTP expiry time (5 minutes from now)
        const expiryTime = Date.now() + 5 * 60 * 1000
        setOtpExpiry(expiryTime)
        setStep("otp")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
      submitAttemptRef.current = false
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submission attempts
    if (isLoading || submitAttemptRef.current) return
    submitAttemptRef.current = true

    setError(null)
    setIsLoading(true)

    try {
      // Check if OTP has expired
      if (otpExpiry && Date.now() > otpExpiry) {
        setError("Verification code has expired. Please request a new one.")
        setIsLoading(false)
        submitAttemptRef.current = false
        return
      }

      const { data, error } = await verifyOtp(phone, otp)

      if (error) {
        setError(error.message)
      } else if (!data?.user || !data?.session) {
        // Проверяем наличие данных пользователя и сессии
        console.error("Authentication successful but no user data returned")
        setError("Authentication failed: Unable to retrieve user data. Please try again.")
      } else {
        // Clear any timers
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        // Показываем уведомление об успешной аутентификации
        toast({
          title: "Authentication successful",
          description: "You have been successfully signed in.",
        })

        // Перенаправляем пользователя
        router.push(redirectTo)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
      submitAttemptRef.current = false
    }
  }

  const handleResendOtp = async () => {
    // Prevent multiple submission attempts
    if (isLoading || submitAttemptRef.current) return
    submitAttemptRef.current = true

    setError(null)
    setIsLoading(true)
    setOtp("")

    try {
      const { error } = await signInWithPhone(phone)

      if (error) {
        setError(error.message)
      } else {
        // Reset OTP expiry time (5 minutes from now)
        const expiryTime = Date.now() + 5 * 60 * 1000
        setOtpExpiry(expiryTime)
        setError(null)

        // Show success message
        toast({
          title: "Verification code sent",
          description: "A new verification code has been sent to your phone.",
        })
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
      submitAttemptRef.current = false
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in with your phone</CardTitle>
        <CardDescription>
          {step === "phone"
            ? "This lets you access your past conversations with Luke and get clarity on timelines and pricing"
            : "Enter the code we sent to your phone"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number including country code"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="otp">Enter the code</Label>
                {timeRemaining !== null && timeRemaining > 0 && (
                  <span className="text-xs text-muted-foreground">Expires in {formatTimeRemaining()}</span>
                )}
              </div>
              <Input
                id="otp"
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
                pattern="\d{6}"
                autoComplete="one-time-code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {step === "otp" && (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setStep("phone")
                setOtp("")
                setError(null)
                if (timerRef.current) {
                  clearInterval(timerRef.current)
                  timerRef.current = null
                }
              }}
              disabled={isLoading}
              className="w-full"
            >
              Use a different phone number
            </Button>

            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={isLoading || (timeRemaining !== null && timeRemaining > 0)}
              className="text-sm"
            >
              Didn't receive a code? Resend
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
