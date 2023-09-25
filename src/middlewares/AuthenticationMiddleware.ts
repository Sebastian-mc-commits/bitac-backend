import { NextFunction, Request, Response } from "express";
import { ErrorHandling, getJsonFromToken, isNull } from "../utils/functions";
import { UserService } from "../services";
import { ErrorHandler } from "../utils/classes";
import ErrorCodes from "../utils/constants/httpErrorCodes";

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

  isNotAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {

    const user = await this.service.getUser(req)

    if (isNull(user)) throw new ErrorHandler({
      customMessage: "Usuario no autenticado",
      httpStatusCode: ErrorCodes.UNAUTORIZED
    })

    next()
  }
}

const Instance = new AuthMiddleware()

export default ErrorHandling<typeof Instance>(Instance)
