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
const category_1 = require("../serverSchema/category");
router.get("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const categories = yield prisma_1.prisma.category.findMany({
            where: { userId: user === null || user === void 0 ? void 0 : user.id }
        });
        return new response_1.ApiResponse(categories, "Categories fetched successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.post("/", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    try {
        const parsed = category_1.categorySchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const category = yield prisma_1.prisma.category.create({
            data: {
                name: parsed.data.name,
                type: parsed.data.type,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        return new response_1.ApiResponse(category, "Category created successfully", 201).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.put("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const parsed = category_1.categorySchema.safeParse(req.body);
        if (!parsed.success) {
            return new response_1.ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const category = yield prisma_1.prisma.category.updateMany({
            where: {
                id,
                userId: user === null || user === void 0 ? void 0 : user.id
            },
            data: {
                name: parsed.data.name,
                type: parsed.data.type
            }
        });
        if (category.count === 0) {
            return new response_1.ApiResponse(null, "Category not found", 404).send(res);
        }
        return new response_1.ApiResponse(category, "Category updated successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
router.delete("/:id", index_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { id } = req.params;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        const category = yield prisma_1.prisma.category.deleteMany({
            where: {
                id,
                userId: user === null || user === void 0 ? void 0 : user.id
            }
        });
        if (category.count === 0) {
            return new response_1.ApiResponse(null, "Category not found", 404).send(res);
        }
        return new response_1.ApiResponse(category, "Category deleted successfully", 200).send(res);
    }
    catch (err) {
        return new response_1.ApiResponse(null, "Internal Server Error", 500).send(res);
    }
}));
exports.default = router;
