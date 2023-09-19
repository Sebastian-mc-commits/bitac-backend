import { UserModel } from "../models";
import { IUser } from "../types";
import { ErrorHandler } from "../utils/classes";
import ErrorCodes from "../utils/constants/httpErrorCodes";
import { isHashedPasswordValid } from "../utils/functions";

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
  }: Omit<IUser, "name">): Promise<IUser> => {
    const user = await this.getUserByEmail(email);

    if (user === null || !(await isHashedPasswordValid(password, user.password))) {
      throw new ErrorHandler({
        customMessage: "Email o contraseña incorrectos",
        httpStatusCode: ErrorCodes.CONFLICT,
      });
    }
    return user as IUser;
  };

  getUserByEmail = async (email: string): Promise<IUser> => {

    return await this.model.findOne({ email }) as IUser || null
  }

  private existByEmail = async (email: string): Promise<boolean> => {
    return (await this.model.exists({ email })) !== null;
  };
}

export default new UserService();
