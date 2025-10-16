import {z} from "zod";

export const resetSchema = z.object({
    email:z.email("Invalid Email Address")
})
export const codeSchema = z.object({
    email:z.email("Invalid Email Address"),
    code:z.string().min(6,{message:"Code must be 6 characters long"}).max(6,{message:"Code must be 6 characters long"})
})

export const newPasswordSchema = z.object({
    email:z.email("Invalid Email Address"),
     password:z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(32, { message: "Password must be at most 32 characters long" })
})
