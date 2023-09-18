import { Response, Request } from "express";
import { ErrorHandling } from "../utils/functions";
import { Reducer } from "../utils/classes";
import { IUser } from "../types";

class User extends Reducer {

  private model

  constructor() {
    super()
    this.model = "model"
  }

  createUser = (req: Request, res: Response): Response => {

    this.validateInputValues<IUser>(["email", "name", "password"], req.body)

    return res.json(req.body)
  }
}

const Instance = new User()

export default ErrorHandling<typeof Instance>(Instance)
