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
const wallet_1 = require("../serverSchema/wallet");
router.get("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const wallets = yield prisma_1.prisma.wallet.findMany({
            where: { userId: user === null || user === void 0 ? void 0 : user.id }
        });
        return new response_1.ApiResponse(wallets, "Wallets fetched successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.post("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const parsed = wallet_1.walletSchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const wallet = yield prisma_1.prisma.wallet.create({
            data: {
                name: parsed.data.name,
                type: parsed.data.type,
                balance: parsed.data.balance,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        return new response_1.ApiResponse(wallet, "Wallet created successfully", 201).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.put("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const walletId = req.params.id;
    try {
        const parsed = wallet_1.walletSchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const wallet = yield prisma_1.prisma.wallet.updateMany({
            where: {
                id: walletId,
                userId: user === null || user === void 0 ? void 0 : user.id
            },
            data: {
                name: parsed.data.name,
                type: parsed.data.type,
                balance: parsed.data.balance,
            }
        });
        if (wallet.count === 0) {
            return new response_1.ApiResponse(null, "Wallet not found", 404).send(res);
        }
        return new response_1.ApiResponse(wallet, "Wallet updated successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.delete("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const walletId = req.params.id;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const wallet = yield prisma_1.prisma.wallet.deleteMany({
            where: {
                id: walletId,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        if (wallet.count === 0) {
            return new response_1.ApiResponse(null, "Wallet not found", 404).send(res);
        }
        return new response_1.ApiResponse(null, "Wallet deleted successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.default = router;
