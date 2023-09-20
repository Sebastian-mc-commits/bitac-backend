import { Types } from "mongoose";

export const getObjectId = <T extends { _id: Types.ObjectId }>(element: T) => element._id

export const getObjectIds = <T>(arr: T[]) => arr.map(c => getObjectId<any>(c)) as Types.ObjectId[]
