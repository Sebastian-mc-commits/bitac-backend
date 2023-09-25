import { Request, Response } from "express";

export type CookieEnumType = {
    code: string;
    user: string;
}

export type CookieEnumTypeString = keyof CookieEnumType

type CookieParams<T> = {
    res: Response,
    cookieName: CookieEnumTypeString,
    body: T
}


export const setCookie = <T extends {}>({cookieName, res, body}: CookieParams<T>): T => {

    res.cookie(cookieName, body, {
        signed: true
    })

    return body
}

export const getCookies = (req: Request) => {

    return req.signedCookies as CookieEnumType
}