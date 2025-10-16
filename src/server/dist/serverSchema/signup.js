"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name must be at most 50 characters long" }),
    email: zod_1.z.email("Invalid Emial Address").refine((val) => val.endsWith("gmail.com"), { message: "Email must be a gmail address" }),
    password: zod_1.z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password must be at most 32 characters long" })
});
