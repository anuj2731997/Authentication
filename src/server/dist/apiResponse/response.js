"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse extends Error {
    constructor(data, message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
    send(res) {
        return res.status(this.statusCode).json({
            message: this.message,
            data: this.data
        });
    }
}
exports.ApiResponse = ApiResponse;
