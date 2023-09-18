import { Response, Request } from 'express';
import { Reducer } from "../utils/classes";
import { ErrorHandling } from '../utils/functions';


class DataTransfer_ extends Reducer {
  
  constructor () {
    super()
  }

  onStoreData = (req: Request, res: Response) => {

    this.handleValidation(() => req.body.length > 0)

    res.json({
      message: "Datos obtenidos"
    })

  }

  getDataCode = () => {

  }

  obtainTransferredData = () => {

  }
}

const Instance = new DataTransfer_()

export default ErrorHandling<typeof Instance>(Instance)