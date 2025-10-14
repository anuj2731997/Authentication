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
const prisma_1 = require("../db/prisma");
const response_1 = require("../apiResponse/response");
const index_1 = require("../middleware/index");
const budget_1 = require("../serverSchema/budget");
const router = express_1.default.Router();
router.get("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
            include: { budgets: true }
        });
        if (!user) {
            return new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            return new response_1.ApiResponse(user.budgets, "Budgets fetched successfully", 200).send(res);
        }
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.post("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const parsed = budget_1.budgetSchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const budget = yield prisma_1.prisma.budget.create({
            data: {
                categoryId: parsed.data.categoryId,
                budgetAmount: parsed.data.budgetAmount,
                month: parsed.data.month,
                year: parsed.data.year,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        return new response_1.ApiResponse(budget, "Budget created successfully", 201).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.put("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const response = budget_1.budgetSchema.safeParse(req.body);
        if (!response.success) {
            return new response_1.ApiResponse(null, response.error.message, 400).send(res);
        }
        const { budgetAmount, categoryId, month, year } = response.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const updatedBuget = yield prisma_1.prisma.budget.updateMany({
            where: {
                id: id,
                userId: user === null || user === void 0 ? void 0 : user.id
            },
            data: {
                categoryId: categoryId,
                budgetAmount: budgetAmount,
                month: month,
                year: year
            }
        });
        if (updatedBuget.count == 0) {
            new response_1.ApiResponse(null, "Budget not found", 404).send(res);
        }
        return new response_1.ApiResponse(updatedBuget, "Budget updated successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.delete("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        const deletedBudget = yield prisma_1.prisma.budget.deleteMany({
            where: {
                id: id,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        if (deletedBudget.count == 0) {
            return new response_1.ApiResponse(null, "Budget not found", 404).send(res);
        }
        return new response_1.ApiResponse(null, "Budget is deleted successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.default = router;
