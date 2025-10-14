"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetSchema = void 0;
const zod_1 = require("zod");
exports.budgetSchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1, "Category ID is required"),
    budgetAmount: zod_1.z.number().min(0, "Budget amount must be greater than 0"),
    month: zod_1.z.number().min(1).max(12),
    year: zod_1.z.number().min(2000)
});
