import express from "express";
const router = express.Router();
import { Request, Response } from "express";
import {prisma} from "../db/prisma";
import { ApiResponse } from "../apiResponse/response";
import { middleware } from "../middleware/index";
import { walletSchema } from "../serverSchema/wallet";



router.get("/",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    try {   
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const wallets = await prisma.wallet.findMany({
            where:{userId:user?.id}
        });
        return new ApiResponse(wallets, "Wallets fetched successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.post("/",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    try {
        const parsed = walletSchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const wallet = await prisma.wallet.create({
            data:{
                name:parsed.data.name,  
                type:parsed.data.type,
                balance:parsed.data.balance,
                userId:user?.id!
            }
        });
        return new ApiResponse(wallet, "Wallet created successfully", 201).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.put("/:id",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    const walletId = req.params.id;
    try {
        const parsed = walletSchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const wallet = await prisma.wallet.updateMany({
            where:{
                id:walletId,
                userId:user?.id
            },
            data:{  
                name:parsed.data.name,
                type:parsed.data.type,
                balance:parsed.data.balance,    
            }
        });
        if(wallet.count === 0){
            return new ApiResponse(null, "Wallet not found", 404).send(res);
        }
        return new ApiResponse(wallet, "Wallet updated successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.delete("/:id",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    const walletId = req.params.id; 
    try {
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const wallet = await prisma.wallet.deleteMany({
            where:{
                id:walletId,
                userId:user?.id
            }
        });
        if(wallet.count === 0){
            return new ApiResponse(null, "Wallet not found", 404).send(res);
        }
        return new ApiResponse(null, "Wallet deleted successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

export default router;