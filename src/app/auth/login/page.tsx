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
import {toast} from "sonner";
import {publicApi} from "@/lib/interceptors/api";
import {useRouter } from "next/navigation"


export default function Login() {
  const router = useRouter();
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const email = event.currentTarget.email.value;
  const password = event.currentTarget.password.value;

  try {
    const login = await publicApi.post("/auth/signin", {
      email, 
      password, 
    });

    toast.success("Login successful 🎉", {
      description: login.data.message,
      className: "sonner-toast sonner-toast-success",
    });

    router.push("/");
  } catch (err: any) {
    console.error(err);

    toast.error("Login failed 😢", {
      description: err.response?.data?.message || "Server error",
      className: "sonner-toast",
    });
  }
}


  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute top-0 left-0 w-full h-full  bg-cover bg-center opacity-20"></div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md bg-black/80 border border-red-900/30 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 tracking-wide">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            Welcome back! Please login.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email */}
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

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <a
                  href="/auth/reset"
                  className="text-sm text-red-500 hover:text-red-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center mt-6">
          <p className="text-sm text-gray-400">
            New to Netflix?{" "}
            <a href="/auth/register" className="text-red-500 hover:text-red-400 underline">
              Sign up now
            </a>
          </p>
          {/* <p className="text-xs text-gray-500 mt-2 text-center">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p> */}
        </CardFooter>
      </Card>
    </div>
  )
}
