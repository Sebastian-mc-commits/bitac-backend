import { NextFunction, Request, Response } from "express";
import { ErrorHandling, getJsonFromToken, isNull } from "../utils/functions";
import { UserService } from "../services";
import { IUser } from "../types";

class AuthMiddleware {
  private service;
  constructor() {
    this.service = UserService;
  }
  isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Response | NextFunction | void> => {

    const user = await this.service.getUser(req)

    if (isNull(user)) return next();

    return res.json({ user });
  };
}

const Instance = new AuthMiddleware()

export default ErrorHandling<typeof Instance>(Instance)
