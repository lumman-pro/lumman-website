import type { Metadata } from "next"
import LoginPageClient from "./login-page-client"

export const metadata: Metadata = {
  title: "Login | Lumman.ai",
  description: "Sign in to your Lumman account",
}

export default function LoginPage() {
  return <LoginPageClient />
}
