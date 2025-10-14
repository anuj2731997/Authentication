import {z} from "zod";



export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
    budgetAmount: z.number().min(0, "Budget amount must be greater than 0"),
    month: z.number().min(1).max(12),
    year: z.number().min(2000)


})