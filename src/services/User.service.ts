import { Request } from "express";
import { UserModel } from "../models";
import { IUser } from "../types";
import { ErrorHandler } from "../utils/classes";
import ErrorCodes from "../utils/constants/httpErrorCodes";
import { getJsonFromToken, isHashedPasswordValid } from "../utils/functions";
import { Types } from "mongoose";

export interface IUserWith_Id extends IUser {
  _id?: Types.ObjectId
}

class UserService {
  private model;

  constructor() {
    this.model = UserModel;
  }

  createUser = async (userData: IUser): Promise<IUser> => {
    if (await this.existByEmail(userData.email)) {
      throw new ErrorHandler({
        customMessage: `El email ${userData.email} ya existe`,
        httpStatusCode: ErrorCodes.CONFLICT,
      });
    }
    // 
    await this.model.create(userData);

    return userData;
  };

  getUserByCredentials = async ({
    email,
    password,
  }: Omit<IUser, "name">): Promise<IUserWith_Id> => {
    const user = await this.getUserByEmail(email);

    if (user === null || !(await isHashedPasswordValid(password, user.password))) {
      throw new ErrorHandler({
        customMessage: "Email o contraseña incorrectos",
        httpStatusCode: ErrorCodes.CONFLICT,
      });
    }
    return user as IUserWith_Id;
  };

  getUserByEmail = async (email: string): Promise<IUserWith_Id> => {

    return await this.model.findOne({ email }) as IUserWith_Id || null
  }

  getUser = async (req: Request): Promise<IUserWith_Id | null> => {
    const { value, isDataValid } = getJsonFromToken(req);

    if (!isDataValid) return null;

    const { email } = value as IUser;

    const user = await this.getUserByEmail(email);

    return user
  }

  private existByEmail = async (email: string): Promise<boolean> => {
    return (await this.model.exists({ email })) !== null;
  };
}

export default new UserService();
