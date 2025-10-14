import express from "express";

export class ApiResponse extends Error {
    statusCode: number;
    data:any;
    constructor(data:any,message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }

    send(res: express.Response){
        return res.status(this.statusCode).json({
            message: this.message,
            data: this.data
        });
    }

}