"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const zod_1 = require("zod");
exports.transactionSchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1, "Category ID is required"),
    walletId: zod_1.z.string().optional(),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]),
    amount: zod_1.z.number().min(0.01, "Amount must be greater than 0"),
    description: zod_1.z.string().max(255).optional(),
});
