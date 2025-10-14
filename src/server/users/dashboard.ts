import express from "express";

const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "../db/prisma";

import { ApiResponse } from "../apiResponse/response";

import { middleware } from "../middleware/index";

router.get("/profile", middleware, async (req: Request, res: Response) => {
    const email = (req as any).email;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        if (!user) {
            return new ApiResponse(null, "User not found", 404).send(res);
        }
        return new ApiResponse(user, "User profile fetched successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);
    }
})

router.get("/dashboard", middleware, async (req: Request, res: Response) => {
    const email = (req as any).email;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        const income = await prisma.transaction.aggregate({
            where: { userId: user?.id, type: 'INCOME' },
            _sum: { amount: true }
        });

        const expense = await prisma.transaction.aggregate({
            where: { userId: user?.id, type: 'EXPENSE' },
            _sum: { amount: true }
        });

        const totalIncome = income._sum.amount || 0;
        const totalExpense = expense._sum.amount || 0;
        const balance = totalIncome - totalExpense;
        return new ApiResponse({ totalIncome, totalExpense, balance }, "Dashboard data fetched successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);
    }

})









export default router;