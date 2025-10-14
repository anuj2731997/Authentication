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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../db/prisma");
const transaction_1 = require("../serverSchema/transaction");
const response_1 = require("../apiResponse/response");
const index_1 = require("../middleware/index");
exports.router = express_1.default.Router();
function alterWalletBalance(walletId, amount, type) {
    if (type === "INCOME") {
        return prisma_1.prisma.wallet.update({
            where: { id: walletId },
            data: {
                balance: { increment: amount }
            }
        });
    }
    else {
        return prisma_1.prisma.wallet.update({
            where: { id: walletId },
            data: {
                balance: { decrement: amount }
            }
        });
    }
}
exports.router.get("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                transactions: true
            }
        });
        if (!user) {
            return new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            return new response_1.ApiResponse(user.transactions, "Transactions fetched successfully", 200).send(res);
        }
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.router.post("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const parsed = transaction_1.transactionSchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        const transaction = yield prisma_1.prisma.transaction.create({
            data: {
                categoryId: parsed.data.categoryId,
                walletId: parsed.data.walletId,
                type: parsed.data.type,
                amount: parsed.data.amount,
                description: parsed.data.description,
                userId: user.id
            }
        });
        if (parsed.data.walletId) {
            yield alterWalletBalance(parsed.data.walletId, parsed.data.amount, parsed.data.type);
        }
        return new response_1.ApiResponse(transaction, "Transaction created successfully", 201).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.router.put("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const parsed = transaction_1.transactionSchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const transaction = yield prisma_1.prisma.transaction.updateMany({
            where: {
                id,
                userId: user === null || user === void 0 ? void 0 : user.id
            },
            data: {
                categoryId: parsed.data.categoryId,
                walletId: parsed.data.walletId,
                type: parsed.data.type,
                amount: parsed.data.amount,
                description: parsed.data.description,
            }
        });
        if (parsed.data.walletId) {
            yield alterWalletBalance(parsed.data.walletId, parsed.data.amount, parsed.data.type);
        }
        if (transaction.count === 0) {
            return new response_1.ApiResponse(null, "Transaction not found", 404).send(res);
        }
        return new response_1.ApiResponse(transaction, "Transaction updated successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.router.delete("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const transaction = yield prisma_1.prisma.transaction.deleteMany({
            where: {
                id,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        if (transaction.count === 0) {
            return new response_1.ApiResponse(null, "Transaction not found", 404).send(res);
        }
        return new response_1.ApiResponse(transaction, "Transaction deleted successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.default = exports.router;
