"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = void 0;
const zod_1 = require("zod");
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid Emial Address"),
    password: zod_1.z.string()
});
