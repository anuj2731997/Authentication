import express from "express";
import { Request, Response } from "express";
import { signupSchema } from "../serverSchema/signup";
import { signinSchema } from "../serverSchema/signin";
import { ApiResponse } from "../apiResponse/response";
import { resetSchema, codeSchema, newPasswordSchema } from "../serverSchema/resetPassword";
import { middleware } from "../middleware";
import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import logger from "../logger";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const generateAccessToken = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};
const generateRefreshToken = (email: string) => {
    const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });

    return token;
};
router.post("/token", async (req: Request, res: Response) => {
    const cookies = req.cookies;
    logger.info("cookies", cookies);

    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
        return new ApiResponse(null, "No refresh token provided", 400).send(res);
    }

    let payload: string;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as string;
    } catch (err) {
        return new ApiResponse(null, "Invalid or expired refresh token", 403).send(res);
    }

    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) {
        return new ApiResponse(null, "User not found", 404).send(res);
    }

    const accessToken = generateAccessToken(user.email);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // ⚠️ only true in HTTPS production
        sameSite: "lax", // or "none" if using cross-site requests
        // domain: "app.myapp.local",
        path: "/",
        maxAge: 3600 * 1000
    });

    new ApiResponse({ accessToken }, "Access token generated", 200).send(res);
});

router.post("/existingUser", async (req: Request, res: Response) => {
    console.log(req.body)
    const response = resetSchema.safeParse(req.body);
    if (!response.success) {
        new ApiResponse(null, response.error.message, 400).send(res);
    } else {
        const { email } = response.data;
        const isExisting = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (isExisting) {
            new ApiResponse({ exists: true }, "User exists", 200).send(res);
        } else {
            new ApiResponse({ exists: false }, "User does not exist", 200).send(res);
        }
    }
});

router.post("/signup", async (req: Request, res: Response) => {
    const body = signupSchema.safeParse(req.body);
    if (!body.success) {
        new ApiResponse(null, body.error.message, 400).send(res);
    }
    else {




        const { name, email, password } = body.data;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);

        const User = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPassword,
                refreshToken: refreshToken
            }
        })

        const data = {
            user: {
                id: User.id,
                name: User.name,
                email: User.email,
                createdAt: User.emailVerified
            },
            accessToken: accessToken,
        }
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // ⚠️ only true in HTTPS production
            sameSite: "lax", // or "none" if using cross-site requests
            // domain: "app.myapp.local",
            path: "/",
            maxAge: 3600 * 1000 // 1 hour
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // ⚠️ only true in HTTPS production
            sameSite: "lax", // or "none" if using cross-site requests
            // domain: "app.myapp.local",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        new ApiResponse(data, "User created successfully", 201).send(res);
    }


})


router.post("/signin", async (req: Request, res: Response) => {
    const response = signinSchema.safeParse(req.body);

    if (!response.success) {
        new ApiResponse(null, response.error.message, 400).send(res);
    } else {
        const { email, password } = response.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            new ApiResponse(null, "Invalid email or password", 400).send(res);

        } else {
            const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
            if (!isPasswordValid) {
                new ApiResponse(null, "Invalid email or password", 400).send(res);
            } else {
                const accessToken = generateAccessToken(email);
                const refreshToken = generateRefreshToken(email);

                const updatedUser = await prisma.user.update({
                    where: {
                        email: email

                    },
                    data: { refreshToken: refreshToken }
                })

                const data = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false, // ⚠️ only true in HTTPS production
                    sameSite: "lax", // or "none" if using cross-site requests
                    // domain: "app.myapp.local",
                    path: "/",
                    maxAge: 3600 //1 hour   
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // ⚠️ only true in HTTPS production
                    sameSite: "lax", // or "none" if using cross-site requests
                    // domain: "app.myapp.local",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });



                new ApiResponse(data, "User signed in successfully", 200).send(res);




            }
        }

    }
})

router.get("/signout",middleware, async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // ⚠️ only true in HTTPS production
        sameSite: "lax", // or "none" if using cross-site requests
        // domain: "app.myapp.local",
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, // ⚠️ only true in HTTPS production
        sameSite: "lax", // or "none" if using cross-site requests
        // domain: "app.myapp.local",
        path: "/",
    });
    new ApiResponse(null, "User signed out successfully", 200).send(res);

})

const createCode = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
}
router.post("/resetPassword", async (req: Request, res: Response) => {
    const response = resetSchema.safeParse(req.body);
    if (!response.success) {
        new ApiResponse(null, response.error.message, 400).send(res);

    } else {
        const { email } = response.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            new ApiResponse(null, "User not found", 404).send(res);
        } else {
            const resetCode = createCode();
            const updatedUser = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    resetPasswordToken: resetCode
                }
            })

            //send email

            const transporter = nodemailer.createTransport({
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
                    new ApiResponse(null, "Error sending email", 500).send(res);
                } else {
                    console.log("Email sent:", info.response);
                    new ApiResponse(null, "Password reset code sent to email", 200).send(res);
                }
            });

        }
    }
})

router.post("/verifyCode", async (req: Request, res: Response) => {
    const response = codeSchema.safeParse(req.body);
    if (!response.success) {
        new ApiResponse(null, response.error.message, 400).send(res);
    } else {
        const { email, code } = response.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            new ApiResponse(null, "User not found", 404).send(res);
        } else {
            if (user.resetPasswordToken !== code) {
                new ApiResponse(null, "Invalid code", 400).send(res);
            } else {
                new ApiResponse(null, "Code verified", 200).send(res);
            }
        }
    }
});

router.post("/newPassword", async (req: Request, res: Response) => {
    const response = newPasswordSchema.safeParse(req.body);
    if (!response.success) {
        new ApiResponse(null, response.error.message, 400).send(res);
    } else {
        const { email, password } = response.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            new ApiResponse(null, "User not found", 404).send(res);
        }
        else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const updatedUser = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    hashedPassword: hashedPassword,
                    resetPasswordToken: null,
                }
            })
            new ApiResponse(null, "Password updated successfully", 200).send(res);
        }
    }

})



export default router;