"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { publicApi } from "@/lib/interceptors/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ResetPassword() {
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // ✅ STEP 1 — Send OTP
  async function handleSendOTP(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = event.currentTarget.email.value
    setUserEmail(email)
    setLoading(true)

    try {
      const sendOtp = await publicApi.post("/auth/resetPassword", { email })
      toast.success("OTP sent successfully 🎉", {
        description: sendOtp.data.message,
        className: "sonner-toast sonner-toast-success",
      })
      setOtpSent(true)
    } catch (error: any) {
      toast.error("Failed to send OTP 😢", {
        description: error.response?.data?.message || "Something went wrong.",
        className: "sonner-toast",
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ STEP 2 — Verify OTP and Reset Password
  async function handleVerifyAndReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = event.currentTarget.otp.value
    const newPass = event.currentTarget.newPassword.value
    const confirmPass = event.currentTarget.confirmPassword.value

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match!", {
        description: "Please re-enter matching passwords.",
      })
      return
    }

    setLoading(true)

    try {
      // Verify OTP
      const verify = await publicApi.post("/auth/verifyCode", {
        email: userEmail,
        code: otp,
      })

      toast.success("OTP verified successfully ✅", {
        description: verify.data.message,
      })

      // Change password
      const change = await publicApi.post("/auth/newPassword", {
        email: userEmail,
        password: newPass,
      })

      toast.success("Password changed successfully 🎉", {
        description: change.data.message,
      })

      setOtpVerified(true)

      setTimeout(() => {
        toast.success("Redirecting to login...", {
          description: "You can now log in with your new password.",
        })
        router.push("/auth/login")
      }, 2500)
    } catch (error: any) {
      toast.error("Failed to reset password 😢", {
        description: error.response?.data?.message || "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/netflix-bg.jpg')] bg-cover bg-center opacity-20"></div>

      {/* Reset Password Card */}
      <Card className="relative z-10 w-full max-w-md bg-black/80 border border-red-900/30 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 tracking-wide">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            {otpVerified
              ? "Password reset successful! You can now log in."
              : otpSent
              ? "Enter the OTP sent to your email and reset your password."
              : "Enter your registered email to receive an OTP."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* STEP 1: Email Form */}
          {!otpSent && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP + Password Form */}
          {otpSent && !otpVerified && (
            <form onSubmit={handleVerifyAndReset} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="otp" className="text-gray-200">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  maxLength={6}
                  required
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all text-center tracking-widest"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-gray-200">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  required
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  required
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Reset Password"}
              </Button>
            </form>
          )}

          {/* STEP 3: Success Message */}
          {otpVerified && (
            <div className="text-center mt-4">
              <p className="text-green-400 font-medium">
                ✅ Your password has been successfully reset!
              </p>
              <a
                href="/auth/login"
                className="text-red-500 hover:text-red-400 underline block mt-3"
              >
                Back to Login
              </a>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center mt-4">
          {!otpVerified && (
            <a
              href="/auth/login"
              className="text-sm text-gray-400 hover:text-red-400 hover:underline"
            >
              Back to Login
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
