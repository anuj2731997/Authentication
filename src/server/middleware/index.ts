import { Request,Response,NextFunction } from "express";
import { ApiResponse } from "../apiResponse/response";
import jwt from "jsonwebtoken";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return new ApiResponse(null, "Unauthorized", 401).send(res);
  }

  try {
    
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { userId: string };

    
    (req as any).email = (decoded as any).email; 

    
    next();

  } catch (err) {
    return new ApiResponse(null, "Unauthorized", 401).send(res);
  }
};