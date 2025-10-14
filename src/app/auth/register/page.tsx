"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useState } from "react"




export default function NetflixSignup() {

//   const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = event.currentTarget.email.value
    const password = event.currentTarget.password.value
    const confirmPassword = event.currentTarget.confirmPassword.value

if (password !== confirmPassword) {
  toast.error("Passwords do not match 😢", {
    description: "Please re-enter both fields carefully.",
    className: "sonner-toast",
  });
  return;
}

// success toast
// toast.success("Password reset successful! 🎉", {
//   description: "You can now log in with your new password.",
//   className: "sonner-toast sonner-toast-success",
// });




    console.log({ email, password, confirmPassword })
   
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-900 text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/netflix-bg.jpg')] bg-cover bg-center opacity-20"></div>

      <Card className="relative z-10 w-full max-w-md bg-black/80 border border-red-800/30 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 tracking-wide">
            Sign Up
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            Create your account to start watching your favorite shows
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@gmail.com"
                
                required
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
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
                placeholder="Re-enter your password"
                required
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/auth/login" className="text-red-500 hover:underline hover:text-red-400">
              Sign In
            </a>
          </p>
          
        </CardFooter>
      </Card>
    </div>
  )
}
