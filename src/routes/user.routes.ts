import { Router, NextFunction, Request, Response } from "express";
import { UserController } from "../controllers";

const router = Router()


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post("/createUser", UserController.createUser)

export default router
