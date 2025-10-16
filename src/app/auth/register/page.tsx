'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { nameSchema } from "@/lib/clientSchema/signup"
import { toast } from "sonner"

export default function Username() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error("Username required ⚠️", {
        description: "Please enter your username before continuing.",
        className: "sonner-toast sonner-toast-error",
      })
      return
    }

    const parsedData = nameSchema.safeParse({ name })
    if (!parsedData.success) {
      toast.error(parsedData.error.message, {
        className: "sonner-toast sonner-toast-error",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      router.push(`/auth/register/username?name=${name}`)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 w-[320px] mx-auto mt-20 bg-[#141414] p-8 rounded-2xl shadow-[0_0_25px_rgba(229,9,20,0.4)] border border-[#E50914] fade-in">
      <h2 className="text-2xl font-bold text-center text-white mb-2">
        Create Your Profile 
      </h2>
      <p className="text-sm text-gray-400 text-center mb-4">
        Choose a unique username.
      </p>

      <Label htmlFor="username" className="text-white text-sm font-semibold">
        Username
      </Label>
      <Input
        id="username"
        type="text"
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#1f1f1f] border-[#333] text-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all duration-300"
      />

      <Button
        onClick={onSubmit}
        disabled={loading}
        className={`mt-4 bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-md py-2 transition-all duration-300 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Please wait..." : "Next"}
      </Button>

      <p className="text-center text-gray-500 text-xs mt-3">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/auth/login")}
          className="text-[#E50914] hover:text-[#b20710] cursor-pointer font-medium"
        >
          Login
        </span>
      </p>
    </div>
  )
}
