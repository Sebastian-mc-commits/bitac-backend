import { Response, Request, NextFunction } from 'express';
import { ErrorHandler, Reducer } from "../utils/classes";
import { ErrorHandling, idZero, isNull } from '../utils/functions';
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

  generatesCode = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

    this.validateComingData(req.body, next)

    const { type } = req.params
    const code = idZero(21)

    const { isValid } = await this.dataTransferService.onStoreData(req, {
      data: req.body as ExpectedDataTransfer,
      useCode: this.isCode(type),
      code,
      useUserId: this.isUser(type)
    })

    let response: OnGetDataResponseType = { code }
    if (!isValid) {
      throw new ErrorHandler({
        customMessage: "Error en la insercion de los datos",
        httpStatusCode: ErrorCodes.CONFLICT
      })
    }


    else if (this.isUser(type)) {
      response = {
        message: "Datos guardados"
      }
    }

    return res.json(response)
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

  obtainTransferredData = async (req: Request, res: Response): Promise<Response> => {
    const { type } = req.params
    const { code = "" } = req.query

    const data = await this.dataTransferService.obtainStoredData(req, {
      useCode: type === "code",
      code: code as string,
      useUserId: type === "user"
    })

    if (data === null) {
      throw new ErrorHandler({
        customMessage: `Error en 
        la obtencion de los datos, por favor, 
        comprueba ${type === "user" ? "tus datos de session" : "el codigo"}`,
        httpStatusCode: ErrorCodes.BAD_REQUEST
      })
    }

    return res.json(data)
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