import { NextFunction, Request, Response } from "express"
import { ErrorHandling, getCookies } from "../utils/functions"
import { ErrorHandler } from "../utils/classes"
import ErrorCodes from "../utils/constants/httpErrorCodes"

const middlewareInstance = new class {

    constructor() { }

    isCodeSet = (req: Request, _res: Response, next: NextFunction) => {

        if (getCookies(req).code) {
            throw new ErrorHandler({
                customMessage: "Ya tienes un codigo creado",
                httpStatusCode: ErrorCodes.UNAUTORIZED
            })
        }

        return next()
    }

    isUserSet = (req: Request, _res: Response, next: NextFunction) => {

        if (getCookies(req).user) {
            throw new ErrorHandler({
                customMessage: "Intenta guardar los datos",
                httpStatusCode: ErrorCodes.UNAUTORIZED
            })
        }

        return next()
    }
}

export default ErrorHandling<typeof middlewareInstance>(middlewareInstance)
