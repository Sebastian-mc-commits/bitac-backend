import { IUser } from "../../types"
import ErrorCodes from "../constants/httpErrorCodes"
import { emailRegex, passwordRegex } from "../constants/regex"
import { isNull, isString } from "../functions"
import ErrorHandler from "./ErrorHandler"

type PermittedTypes = keyof IUser

export default class {

  constructor() {

  }
  protected validateInputValues<T>(neededValues: (keyof T)[], object: T): Boolean {

    for (const key of neededValues) {
      const value = object[key]

      const { hasError, message } = this.reducer(value, key as PermittedTypes)
      if (hasError) {
        throw new ErrorHandler({
          customMessage: message,
          httpStatusCode: ErrorCodes.BAD_REQUEST,
        })
      }
    }
    
    return true
  }
  
  protected handleValidation (fn: () => boolean) {
    if (!fn()) {
      throw new ErrorHandler({
        customMessage: "Algo fue mal, intenta nuevamente",
        httpStatusCode: ErrorCodes.UNPROCESSABLE_ENTITY,
      })
    }
  }

  protected reducer<T>(value: T, type: PermittedTypes) {

    let message = ""
    let hasError = false

    if (!isNull(value)) {
      switch (type) {

        case "name": {
          if (!isString(value) || (value as string).length < 2) {
            message = "El nombre debe ser mayor a 2 caracteres"
            hasError = true
          }

          break
        }
        case "password": {
          if (!isString(value) || !passwordRegex.test(value as string)) {
            message = "El nombre debe ser mayor a 2 caracteres"
            hasError = true
          }

          break
        }
        case "email": {
          if (!isString(value) || !emailRegex.test(value as string)) {
            message = "El email es incorrecto"
            hasError = true
          }

          break
        }

        default:
          break
      }
    }
    else {
      message = "El valor no puede ser nulo"
      hasError = true
    }

    return {
      message,
      hasError
    }
  }
}
