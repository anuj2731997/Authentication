"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletSchema = void 0;
const zod_1 = require("zod");
exports.walletSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    type: zod_1.z.string().min(1, "Type is required"),
    balance: zod_1.z.number().min(0, "Balance must be a positive number"),
});
