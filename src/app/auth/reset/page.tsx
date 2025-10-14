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

export default function ResetPassword() {
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  function handleSendOTP(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = event.currentTarget.email.value
    console.log("OTP sent to:", email)
    // Simulate API call
    setOtpSent(true)
  }

  function handleVerifyAndReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = event.currentTarget.otp.value
    const newPass = event.currentTarget.newPassword.value
    const confirmPass = event.currentTarget.confirmPassword.value

    if (newPass !== confirmPass) {
      alert("Passwords do not match!")
      return
    }

    console.log("OTP:", otp, "New Password:", newPass)
    // Here you can call your backend API for OTP verification and password reset
    setOtpVerified(true)
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
          {!otpSent && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              {/* Email Input */}
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                Send OTP
              </Button>
            </form>
          )}

          {otpSent && !otpVerified && (
            <form onSubmit={handleVerifyAndReset} className="space-y-6">
              {/* OTP Input */}
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

              {/* New Password */}
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

              {/* Confirm Password */}
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                Verify & Reset Password
              </Button>
            </form>
          )}

          {otpVerified && (
            <div className="text-center mt-4">
              <p className="text-green-400 font-medium">
                ✅ Your password has been successfully reset!
              </p>
              <a
                href="/login"
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
