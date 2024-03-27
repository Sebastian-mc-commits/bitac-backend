import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../utils/classes";
import ErrorCodes from "../utils/constants/httpErrorCodes";

const errorMiddleware = (error: ErrorHandler | Error, _req: Request, res: Response, next: NextFunction): Response => {

  if (!(error instanceof ErrorHandler)) {
    error = new ErrorHandler({
      customMessage: "Hubo un error inesperado",
      httpStatusCode: ErrorCodes.NOT_FOUND,
      message: error.message
    })
  }
  const { customMessage, httpStatusCode, message } = error as ErrorHandler


  return res.status(httpStatusCode).json({
    customMessage,
    httpStatusCode,
    message
  })

}

export default errorMiddleware
