import { NextFunction, Request, Response } from "express";
import { ErrorHandling, getJsonFromToken } from "../utils/functions";
import { UserService } from "../services";
import { IUser } from "../types";

class AuthMiddleware {
  private service;
  constructor() {
    this.service = UserService;
  }
  isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Response | NextFunction | void> => {
    const { value, isDataValid } = getJsonFromToken(req);

    if (!isDataValid) return next();

    const { email } = value as IUser;

    const user = await this.service.getUserByEmail(email);

    if (user !== null) {
      return res.json({ user });
    }

    return next();
  };
}

const Instance = new AuthMiddleware()

export default ErrorHandling<typeof Instance>(Instance)
