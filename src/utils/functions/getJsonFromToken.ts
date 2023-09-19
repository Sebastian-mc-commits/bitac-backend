import { Request } from "express"
import config from "../../config/config"
import jwt from "jsonwebtoken"
import { isNull } from "./utilities"

const { JWT_SECRET } = config

export const getJsonFromToken = <T>(request: Request) => {
  const authHeader = request?.headers["authorization"] ?? ""
  let token = ""
  let value: null | T = null

  if (authHeader.length > 5) {
    token = authHeader?.split(" ")[1]

    try {
      value = jwt.verify(token, JWT_SECRET as string) as T
    }
    catch {
      value = null
    }
  }

  const isDataValid = !isNull(token) && !isNull(value)

  return {
    token,
    value,
    isDataValid
  }
}

export const signPayload = <T extends {}>(payload: T): string => {

  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "30d"
  })
}