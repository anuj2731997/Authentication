import { z} from "zod";

export const signupSchema = z.object({
    name:z.string().min(2,{message:"Name must be at least 2 characters long"}).max(50,{message:"Name must be at most 50 characters long"}),
    email:z.email("Invalid Emial Address").refine((val)=> val.endsWith("gmail.com"),{message:"Email must be a gmail address"}),
    password:z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(32, { message: "Password must be at most 32 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, { message: "Password must contain at least one special character" })
});


