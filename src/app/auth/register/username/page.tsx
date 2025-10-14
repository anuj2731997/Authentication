'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import api from "@/lib/interceptors/api"
import { toast } from "sonner"

export default function Username({ params }: { params: { email: string; password: string } }) {
  const { email, password } = params
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error("Username required ⚠️", {
        description: "Please enter your username before continuing.",
        className: "sonner-toast",
      })
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/auth/signup", { email, password, name })

      toast.success(response.data.data.message, {
        description: "You can now log in with your new password.",
        className: "sonner-toast sonner-toast-success",
      })

      router.push("/auth/login")
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong 😢"
      toast.error("Registration failed", {
        description: message,
        className: "sonner-toast",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[320px] mx-auto mt-20 bg-[#141414] p-6 rounded-2xl shadow-lg border border-[#E50914]">
      <Label htmlFor="username" className="text-white text-sm font-semibold">
        Username
      </Label>
      <Input
        id="username"
        type="text"
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#1f1f1f] border-[#333] text-white focus:ring-[#E50914]"
      />
      <Button
        onClick={onSubmit}
        disabled={loading}
        className={`bg-[#E50914] hover:bg-[#b20710] text-white font-semibold ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Please wait..." : "Next"}
      </Button>
    </div>
  )
}
