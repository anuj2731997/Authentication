import express from "express";

import { prisma } from "../db/prisma";
import { Request, Response } from "express";
import { transactionSchema } from "../serverSchema/transaction";
import { ApiResponse } from "../apiResponse/response";
import { middleware } from "../middleware/index";

export const router = express.Router();



  function alterWalletBalance(walletId: string, amount: number, type: "INCOME" | "EXPENSE"){
    if(type === "INCOME"){
        return prisma.wallet.update({
            where:{id:walletId},
            data:{
                balance:{increment:amount}
            }
        })
    }else{
        return prisma.wallet.update({
            where:{id:walletId},
            data:{
                balance:{decrement:amount}
            }
        })
    }
}

router.get("/",middleware, async (req:Request, res:Response) => {
    const email = (req as any).email;

    try{
        const user = await prisma.user.findUnique({
            where:{
                email:email
            },
            include:{
                transactions:true
            }
        })
       if(!user){
        return new ApiResponse(null, "User not found", 404).send(res);
       }else{
        return new ApiResponse(user.transactions, "Transactions fetched successfully", 200).send(res);
       }

    } catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);
    }
})


router.post("/",middleware, async (req:Request, res:Response) => {
    const email = (req as any).email;

    try{
        const parsed = transactionSchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = await prisma.user.findUnique({
            where:{
                email:email 
            }
        })
        if(!user){
            return new ApiResponse(null, "User not found", 404).send(res);
        }   
        const transaction = await prisma.transaction.create({
            data:{
                categoryId:parsed.data.categoryId,
                walletId:parsed.data.walletId,
                type:parsed.data.type,  
                amount:parsed.data.amount,
                description:parsed.data.description,
                userId:user.id
            }
        })
        if(parsed.data.walletId){
            await alterWalletBalance(parsed.data.walletId, parsed.data.amount, parsed.data.type);
        }
        return new ApiResponse(transaction, "Transaction created successfully", 201).send(res);
    } catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})


router.put("/:id",middleware, async (req:Request, res:Response) => {
    const email = (req as any).email;
    const {id} = req.params;
    try{
        const parsed = transactionSchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }   
        const user = await prisma.user.findUnique({
            where:{email}
        });


        const transaction = await prisma.transaction.updateMany({
            where:{
                id,
                userId:user?.id
            },
            data:{
                categoryId:parsed.data.categoryId,
                walletId:parsed.data.walletId,
                type:parsed.data.type,  
                amount:parsed.data.amount,
                description:parsed.data.description,
            }
        });
        if(parsed.data.walletId){
            await alterWalletBalance(parsed.data.walletId, parsed.data.amount, parsed.data.type);
        }

        if(transaction.count === 0){
            return new ApiResponse(null, "Transaction not found", 404).send(res);
        }   
        return new ApiResponse(transaction, "Transaction updated successfully", 200).send(res);
    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.delete("/:id",middleware, async (req:Request, res:Response) => {
    const email = (req as any).email;
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({
            where:{email}
        }); 
        const transaction = await prisma.transaction.deleteMany({
            where:{
                id,
                userId:user?.id
            }
        });
        if(transaction.count === 0){
            return new ApiResponse(null, "Transaction not found", 404).send(res);
        }
        return new ApiResponse(transaction, "Transaction deleted successfully", 200).send(res);
    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }

})


export default router;