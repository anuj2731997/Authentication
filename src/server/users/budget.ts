import express from "express";
import {Request, Response} from "express";
import {prisma } from "../db/prisma";
import {ApiResponse} from "../apiResponse/response"
import { middleware } from "../middleware/index";
import { budgetSchema } from "../serverSchema/budget";


const router = express.Router();

router.get("/",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    try {
        const user = await prisma.user.findUnique({
            where:{email},
            include:{budgets:true}
        });

        if(!user){
            return new ApiResponse(null, "User not found", 404).send(res);
        }else{
            return new ApiResponse(user.budgets, "Budgets fetched successfully", 200).send(res);
        }
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
        });



router.post("/",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    try {
        const parsed = budgetSchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const budget = await prisma.budget.create({
            data:{
                categoryId:parsed.data.categoryId,
                budgetAmount:parsed.data.budgetAmount,
                month:parsed.data.month,    
                year:parsed.data.year,
                userId:user?.id!
            }
        });
        return new ApiResponse(budget, "Budget created successfully", 201).send(res);
    } catch ( err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }   
})        

router.put("/:id",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    const {id} = req.params;
    try{
        const response =   budgetSchema.safeParse(req.body);
        if(!response.success){
            return  new ApiResponse(null, response.error.message, 400).send(res);
        }

        const {budgetAmount,categoryId,month, year} = response.data;
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }

       
        })
            const updatedBuget = await prisma.budget.updateMany({
            where:{
                id:id,
                userId:user?.id!
            },
            data:{
                categoryId:categoryId,
                budgetAmount:budgetAmount,
                month:month,
                year:year
            }
           });

           if(updatedBuget.count==0){
            new ApiResponse(null, "Budget not found",404).send(res)
           }
           return new ApiResponse(updatedBuget,"Budget updated successfully",200).send(res);

    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.delete("/:id",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        const deletedBudget = await prisma.budget.deleteMany({
            where:{
                id:id,
                userId:user?.id!
            }
        })

        if(deletedBudget.count==0){
            return new ApiResponse(null,"Budget not found",404).send(res);

        }
        return new ApiResponse(null,"Budget is deleted successfully",200).send(res);
    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res); 
    }
})


export default router;