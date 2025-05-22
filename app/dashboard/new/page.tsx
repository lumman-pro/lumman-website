"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function NewChatPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Открываем внешний сервис Eleven Labs для разговора с Luke
    window.open("https://elevenlabs.io/chat", "_blank")
    
    // Показываем сообщение и перенаправляем на dashboard
    toast({
      title: "Conversation with Luke",
      description: "Opening conversation with Luke in a new tab.",
    })
    
    // Перенаправляем на dashboard после короткой задержки
    const timeout = setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
    
    return () => clearTimeout(timeout)
  }, [router, toast])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Opening conversation with Luke...</p>
        <p className="text-sm text-muted-foreground mt-2">
          You will be redirected to the dashboard shortly.
        </p>
      </div>
    </div>
  )
}
