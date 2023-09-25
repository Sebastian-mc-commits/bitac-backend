import { Response, Request, NextFunction } from 'express';
import { ErrorHandler, Reducer } from "../utils/classes";
import { ErrorHandling, getCookies, idZero, isNull, setCookie } from '../utils/functions';
import { DataTransferService, ExpectedDataTransfer } from '../services';
import ErrorCodes from '../utils/constants/httpErrorCodes';

type OnGetDataResponseType = ({
  code: string
}) |
  ({
    message: string
  })
  |
{}
class DataTransfer_ extends Reducer {

  private dataTransferService
  private isUser = (type: string) => type === "user"
  private isCode = (type: string) => type === "code"

  constructor() {
    super()
    this.dataTransferService = DataTransferService
  }

  onInsertData = (useUser: boolean): (req: Request, res: Response, next: NextFunction) => Promise<Response> => {

    return async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

      this.validateComingData(req.body, next)

      const code = idZero(21)

      const { isValid } = await this.dataTransferService.onStoreData(req, {
        data: req.body as ExpectedDataTransfer,
        useCode: !useUser,
        code,
        useUserId: useUser
      })

      let response: OnGetDataResponseType = { code }
      if (!isValid) {
        throw new ErrorHandler({
          customMessage: "Error en la insercion de los datos",
          httpStatusCode: ErrorCodes.CONFLICT
        })
      }


      else if (useUser) {
        response = {
          message: "Datos guardados"
        }
      }

      else if (!useUser) {
        setCookie({
          body: {
            code
          },
          cookieName: "code",
          res
        })

      }

      return res.json(response)
    }
  }

  removeCode = async (req: Request, res: Response): Promise<Response> => {

    const { code = "" } = req.params
    const { isValid } = await this.dataTransferService.onRemoveData(req, {
      useCode: true,
      useUserId: false,
      code
    })

    if (!isValid) {
      throw new ErrorHandler({
        customMessage: "Error en el cambio de codigo",
        httpStatusCode: ErrorCodes.UNPROCESSABLE_ENTITY
      })
    }

    return res.json({
      message: `Codigo: ${code} eliminado`
    })
  }

  obtainTransferredData = (useUser: boolean): (req: Request, res: Response) => Promise<Response> => {

    return async (req: Request, res: Response) => {
      const { code = "" } = req.query

      const data = await this.dataTransferService.obtainStoredData(req, {
        useCode: !useUser,
        code: code as string,
        useUserId: useUser
      })

      if (data === null) {
        throw new ErrorHandler({
          customMessage: `Error en 
        la obtencion de los datos, por favor, 
        comprueba ${useUser ? "tus datos de session" : "el codigo"}`,
          httpStatusCode: ErrorCodes.BAD_REQUEST
        })
      }

      return res.json(data)
    }
  }

  private validateComingData = (data: ExpectedDataTransfer, _next: NextFunction) => {
    this.handleValidation(() =>
      this.contains<ExpectedDataTransfer>(
        [
          "cities",
          "destinations",
          "senders",
          "transporters"
        ],
        data
      )
      &&
      Object.keys(data).every(key => data[key as keyof ExpectedDataTransfer].length > 0)
    )
  }
}

const Instance = new DataTransfer_()

export default ErrorHandling<typeof Instance>(Instance)