import express from "express";
const router = express.Router();

import { Request, Response } from "express";
import {prisma } from "../db/prisma";
import {ApiResponse} from "../apiResponse/response";
import { middleware } from "../middleware/index";
import { categorySchema } from "../serverSchema/category";


router.get("/",middleware,async(req:Request,res:Response)=>{
    const email = (req as any).email;
    try {   
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const categories = await prisma.category.findMany({ 
            where:{userId:user?.id}
        });
        return new ApiResponse(categories, "Categories fetched successfully", 200).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.post("/",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    try {
        const parsed = categorySchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const category = await prisma.category.create({
            data:{
                name:parsed.data.name,
                type:parsed.data.type,
                userId:user?.id!
            }
        });
        return new ApiResponse(category, "Category created successfully", 201).send(res);
    } catch (err) {
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   
    }
})

router.put("/:id",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    const {id } = req.params;
    try{
        const parsed = categorySchema.safeParse(req.body);
        if(!parsed.success){
            return new ApiResponse(null, parsed.error.message, 400).send(res);
        }   
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const category = await prisma.category.updateMany({
            where:{
                id,
                userId:user?.id
            },
            data:{  
                name:parsed.data.name,
                type:parsed.data.type
            }
        }); 
        if(category.count === 0){
            return new ApiResponse(null, "Category not found", 404).send(res);
        }
        return new ApiResponse(category, "Category updated successfully", 200).send(res);
    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);   

    }
})

router.delete("/:id",middleware,async (req:Request,res:Response)=>{
    const email = (req as any).email;
    const {id } = req.params;
    try{
        const user = await prisma.user.findUnique({
            where:{email}
        });
        const category = await prisma.category.deleteMany({
            where:{
                id,
                userId:user?.id
            }
        }); 
        if(category.count === 0){
            return new ApiResponse(null, "Category not found", 404).send(res);
        }

        return new ApiResponse(category, "Category deleted successfully", 200).send(res);
    }catch(err){
        return new ApiResponse(null, "Internal Server Error", 500).send(res);
    }
})

export default router;