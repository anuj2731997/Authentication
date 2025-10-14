"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const response_1 = require("../apiResponse/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return new response_1.ApiResponse(null, "Unauthorized", 401).send(res);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.email = decoded.email;
        next();
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Unauthorized", 401).send(res);
    }
};
exports.middleware = middleware;
