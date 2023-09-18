import ErrorCodes from "../constants/httpErrorCodes";

export type ErrorHandlerTypes = {
  customMessage?: string;
  httpStatusCode?: ErrorCodes;
  message?: string;
}

export default class extends Error {

  public customMessage: string
  public httpStatusCode: number

  constructor ({customMessage = "", message = "", httpStatusCode = ErrorCodes.SERVER_ERROR}: ErrorHandlerTypes) {
    super()
    this.message = message
    this.httpStatusCode = httpStatusCode
    this.customMessage = customMessage
  }
}