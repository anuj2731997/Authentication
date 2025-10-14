import {z} from 'zod';

export const walletSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type:z.string().min(1, "Type is required"),
    balance:z.number().min(0, "Balance must be a positive number"),
})