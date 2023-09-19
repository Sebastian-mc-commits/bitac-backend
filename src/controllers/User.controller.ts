import { Response, Request } from "express";
import { ErrorHandling, signPayload } from "../utils/functions";
import { Reducer } from "../utils/classes";
import { IUser } from "../types";
import { UserService } from "../services";

class User extends Reducer {

  private service

  constructor() {
    super()
    this.service = UserService
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {

    this.validateInputValues<IUser>(["email", "name", "password"], req.body)

    const user = await this.service.createUser(req.body)

    return res.json({ user, token: signPayload(user) })
  }

  getUserByCredentials = async (req: Request, res: Response): Promise<Response> => {

    this.validateInputValues<Omit<IUser, "name">>(["email", "password"], req.body)

    const user = await this.service.getUserByCredentials(req.body)

    return res.json({
      user, token: signPayload({
        email: user.email,
        name: user.name
      })
    })
  }
}

const Instance = new User()

export default ErrorHandling<typeof Instance>(Instance)
