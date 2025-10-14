
import {z} from "zod";



export const transactionSchema = z.object({
    
    categoryId: z.string().min(1, "Category ID is required"),
    walletId: z.string().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    description: z.string().max(255).optional(),


})