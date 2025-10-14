"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma_1 = require("../db/prisma");
const response_1 = require("../apiResponse/response");
const index_1 = require("../middleware/index");
router.get("/profile", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        if (!user) {
            return new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        return new response_1.ApiResponse(user, "User profile fetched successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.get("/dashboard", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const income = yield prisma_1.prisma.transaction.aggregate({
            where: { userId: user === null || user === void 0 ? void 0 : user.id, type: 'INCOME' },
            _sum: { amount: true }
        });
        const expense = yield prisma_1.prisma.transaction.aggregate({
            where: { userId: user === null || user === void 0 ? void 0 : user.id, type: 'EXPENSE' },
            _sum: { amount: true }
        });
        const totalIncome = income._sum.amount || 0;
        const totalExpense = expense._sum.amount || 0;
        const balance = totalIncome - totalExpense;
        return new response_1.ApiResponse({ totalIncome, totalExpense, balance }, "Dashboard data fetched successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.default = router;
