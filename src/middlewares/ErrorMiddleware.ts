import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../utils/classes";

const errorMiddleware = (error: ErrorHandler, _req: Request, res: Response, next: NextFunction) => {

  const {customMessage, httpStatusCode, message} = error

  res.status(httpStatusCode).json({
    customMessage,
    httpStatusCode,
    message
  })

}

export default errorMiddleware
