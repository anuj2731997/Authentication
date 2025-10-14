import express from "express";

const router = express.Router();

import Budget from "./budget";
import Category from "./category";
import Dashboard from "./dashboard";
import Transaction   from "./transaction";
import Wallet from "./wallet";


router.use("/categories",Category);
router.use("/budgets",Budget);
router.use("/",Dashboard);
router.use("/transactions",Transaction);
router.use("/wallets",Wallet);

export default router;



