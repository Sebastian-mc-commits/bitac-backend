import { ClientSession, startSession } from "mongoose"

export interface ITypeWithIdAndUserOps {
  id?: number | string
}

export const useTransaction = async <T>(callback: (transaction: ClientSession) => Promise<unknown>): Promise<T | null> => {

  const session = await startSession()
  let endValue: T | null

  try {

    session.startTransaction()
    const callbackReturnedData = await callback(session)

    endValue = callbackReturnedData as T
  }
  catch (e) {
    await session.abortTransaction()
    endValue = null
  }

  await session.endSession()
  return endValue
}