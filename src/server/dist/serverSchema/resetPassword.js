"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordSchema = exports.codeSchema = exports.resetSchema = void 0;
const zod_1 = require("zod");
exports.resetSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid Email Address")
});
exports.codeSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid Email Address"),
    code: zod_1.z.string().min(6, { message: "Code must be 6 characters long" }).max(6, { message: "Code must be 6 characters long" })
});
exports.newPasswordSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid Email Address"),
    password: zod_1.z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password must be at most 32 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[\W_]/, { message: "Password must contain at least one special character" })
});
