import {z} from "zod";

export const signinSchema = z.object({
    email:z.email("Invalid Emial Address"),
    password:z.string()
})

