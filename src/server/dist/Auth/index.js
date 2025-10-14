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
const signup_1 = require("../serverSchema/signup");
const signin_1 = require("../serverSchema/signin");
const response_1 = require("../apiResponse/response");
const resetPassword_1 = require("../serverSchema/resetPassword");
const middleware_1 = require("../middleware");
const prisma_1 = require("../db/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
const generateAccessToken = (email) => {
    return jsonwebtoken_1.default.sign(email, process.env.JWT_SECRET, { expiresIn: "1h" });
};
const generateRefreshToken = (email) => {
    const token = jsonwebtoken_1.default.sign(email, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return token;
};
router.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
        new response_1.ApiResponse(null, "No refresh token provided", 400).send(res);
    }
    else {
        const isValid = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!isValid) {
            new response_1.ApiResponse(null, "Invalid refresh token", 403).send(res);
        }
        else {
            const user = yield prisma_1.prisma.user.findFirst({
                where: {
                    refreshToken: refreshToken
                }
            });
            const accessToken = generateAccessToken(user === null || user === void 0 ? void 0 : user.email);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
                maxAge: 3600 //1 hour
            });
            new response_1.ApiResponse({ accessToken: accessToken }, "Access token generated", 200).send(res);
        }
    }
}));
router.get("/existingUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = resetPassword_1.resetSchema.safeParse(req.body);
    if (!response.success) {
        new response_1.ApiResponse(null, response.error.message, 400).send(res);
    }
    else {
        const { email } = response.data;
        const isExisting = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (isExisting) {
            new response_1.ApiResponse({ exists: true }, "User exists", 200).send(res);
        }
        else {
            new response_1.ApiResponse({ exists: false }, "User does not exist", 200).send(res);
        }
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = signup_1.signupSchema.safeParse(req.body);
    if (!body.success) {
        new response_1.ApiResponse(null, body.error.message, 400).send(res);
    }
    else {
        const { name, email, password } = body.data;
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);
        const user = yield prisma_1.prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPassword,
                refreshToken: refreshToken
            }
        });
        const data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.emailVerified
            },
            accessToken: accessToken,
        };
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: false,
            maxAge: 3600 //1 hour
        });
        res.cookie("refressToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        new response_1.ApiResponse(data, "User created successfully", 201).send(res);
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = signin_1.signinSchema.safeParse(req.body);
    const cookies = req.cookies;
    if (!response.success) {
        new response_1.ApiResponse(null, response.error.message, 400).send(res);
    }
    else {
        const { email, password } = response.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            new response_1.ApiResponse(null, "Invalid email or password", 400).send(res);
        }
        else {
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.hashedPassword);
            if (!isPasswordValid) {
                new response_1.ApiResponse(null, "Invalid email or password", 400).send(res);
            }
            else {
                const accessToken = generateAccessToken(email);
                const refreshToken = generateRefreshToken(email);
                cookies.set("token", accessToken, {
                    maxAge: 3600 //1 hour   
                });
                const updatedUser = yield prisma_1.prisma.user.update({
                    where: {
                        email: email
                    },
                    data: { refreshToken: refreshToken }
                });
                const data = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken
                };
                res.cookie("token", accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: false,
                    maxAge: 3600 //1 hour   
                });
                res.cookie("refressToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                new response_1.ApiResponse(data, "User signed in successfully", 200).send(res);
            }
        }
    }
}));
router.get("/signout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: false,
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: false,
    });
    new response_1.ApiResponse(null, "User signed out successfully", 200).send(res);
}));
const createCode = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};
router.post("/resetPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = resetPassword_1.resetSchema.safeParse(req.body);
    if (!response.success) {
        new response_1.ApiResponse(null, response.error.message, 400).send(res);
    }
    else {
        const { email } = response.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            const resetCode = createCode();
            const updatedUser = yield prisma_1.prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    resetPasswordToken: resetCode
                }
            });
            //send email
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                secure: false,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Password Reset Code",
                text: `Your password reset code is ${resetCode}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error sending email:", error);
                    new response_1.ApiResponse(null, "Error sending email", 500).send(res);
                }
                else {
                    console.log("Email sent:", info.response);
                    new response_1.ApiResponse(null, "Password reset code sent to email", 200).send(res);
                }
            });
        }
    }
}));
router.post("/verifyCode", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = resetPassword_1.codeSchema.safeParse(req.body);
    if (!response.success) {
        new response_1.ApiResponse(null, response.error.message, 400).send(res);
    }
    else {
        const { email, code } = response.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            if (user.resetPasswordToken !== code) {
                new response_1.ApiResponse(null, "Invalid code", 400).send(res);
            }
            else {
                new response_1.ApiResponse(null, "Code verified", 200).send(res);
            }
        }
    }
}));
router.post("/newPassword", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = resetPassword_1.newPasswordSchema.safeParse(req.body);
    if (!response.success) {
        new response_1.ApiResponse(null, response.error.message, 400).send(res);
    }
    else {
        const { email, password } = response.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            new response_1.ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            const updatedUser = yield prisma_1.prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    hashedPassword: hashedPassword,
                    resetPasswordToken: null,
                }
            });
            new response_1.ApiResponse(null, "Password updated successfully", 200).send(res);
        }
    }
}));
exports.default = router;
