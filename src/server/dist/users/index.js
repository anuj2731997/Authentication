"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const budget_1 = __importDefault(require("./budget"));
const category_1 = __importDefault(require("./category"));
const dashboard_1 = __importDefault(require("./dashboard"));
const transaction_1 = __importDefault(require("./transaction"));
const wallet_1 = __importDefault(require("./wallet"));
router.use("/categories", category_1.default);
router.use("/budgets", budget_1.default);
router.use("/", dashboard_1.default);
router.use("/transactions", transaction_1.default);
router.use("/wallets", wallet_1.default);
exports.default = router;
