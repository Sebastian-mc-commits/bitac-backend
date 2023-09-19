import { genSalt, compare, hash } from "bcrypt";

export const getHashedPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const isHashedPasswordValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword);
};
