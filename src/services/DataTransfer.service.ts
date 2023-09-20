import { Types } from "mongoose";
import { ICity, IDestination, ISender, ITransferredData, ITransporter } from "../types";
import UserService from "./User.service";
import { Request } from "express";
import { getObjectIds, isNull } from "../utils/functions";
import { CityModel, DataTransferredModel, DestinationModel, ITransferredDataWithTransferredData, IUserWithTransferredData, SenderModel, TransporterModel, UserModel, useTransaction } from "../models";

export type ExpectedDataTransfer = {
  cities: ICity[];
  transporters: ITransporter[];
  senders: ISender[];
  destinations: IDestination[]
}

type OnStoreDataProps<T> = {
  code?: string,
  useUserId: boolean,
  data: T,
  useCode: boolean
}

type OnReturnServiceType<T> = {
  data?: T,
  isValid: boolean
}

type OnSelectStoreType = (
  {
    ownerOfDataTransfer: Types.ObjectId
  }
) | (
    {
      code: string
    }
  ) | {}

type RemoveTransferredDataType = {
  cityIds: Types.ObjectId[],
  transporterIds?: Types.ObjectId[],
  senderIds?: Types.ObjectId[],
  destinationIds?: Types.ObjectId[]
}

export default new class {

  private userService

  constructor() {

    this.userService = UserService
  }

  onStoreData = async (req: Request, { data, useUserId, code = "", useCode }: OnStoreDataProps<ExpectedDataTransfer>): Promise<OnReturnServiceType<unknown>> => {

    const { cities, transporters, destinations, senders } = data

    const isTransactionValid = await useTransaction<boolean>(async (session) => {
      const data = await Promise.all([
        CityModel.insertMany(cities),
        TransporterModel.insertMany(transporters),
        SenderModel.insertMany(senders),
        DestinationModel.insertMany(destinations)
      ])

      const [city, transporter, sender, destination] = data

      const transferredData = {
        cities: city,
        transporters: transporter,
        destinations: destination,
        senders: sender
      }

      if (useCode) {
        await DataTransferredModel.create({
          code,
          transferredIn: new Date(),
          transferredData
        })
      }
      else if (useUserId) {
        const user = await this.userService.getUser(req)

        if (user === null || isNull(user)) {
          await session.abortTransaction()
          return false
        }

        await UserModel.updateOne({ email: user?.email as string }, {
          $set: {
            transferredData
          }
        }, { upsert: false })
      }

      await session.commitTransaction()

      return true
    })

    // if (isNull(isTransactionValid)) return {
    //   isValid: false
    // }

    return {
      isValid: Boolean(isTransactionValid),
      data: isTransactionValid
    }
  }

  obtainStoredData = async (req: Request, { useCode, useUserId, code }: Omit<OnStoreDataProps<unknown>, "data">): Promise<IUserWithTransferredData | ITransferredDataWithTransferredData | null> => {

    let data: IUserWithTransferredData | ITransferredDataWithTransferredData | null = null

    if (useCode) {
      data = await DataTransferredModel.findOne({ code })

      console.log(data)
      //       if (!isNull(data)) {
      //         const { transferredIn, transferredData } = data as ITransferredDataWithTransferredData
      //         const { cities, destinations, senders, transporters } = transferredData as ExpectedDataTransfer
      // 
      //         if (new Date() > transferredIn) {
      //           await this.removeData({
      //             cityIds: getObjectIds(cities),
      //             destinationIds: getObjectIds(destinations),
      //             senderIds: getObjectIds(senders),
      //             transporterIds: getObjectIds(transporters)
      //           })
      //         }
      //       }
    }

    else if (useUserId) {

      const user = await this.userService.getUser(req)

      if (user !== null || !isNull(user)) {
        data = await UserModel.findOne({ email: user?.email })
      }
    }
    return data
  }

  removeData = async ({ cityIds, destinationIds, senderIds, transporterIds }: RemoveTransferredDataType): Promise<boolean | null> => {

    return useTransaction<boolean>(async (session) => {
      const areDeleted = await Promise.all([
        CityModel.deleteMany({ _id: { $in: cityIds } }),
        TransporterModel.deleteMany({ _id: { $in: transporterIds } }),
        SenderModel.deleteMany({ _id: { $in: senderIds } }),
        DestinationModel.deleteMany({ _id: { $in: destinationIds } })
      ])

      if (isNull(areDeleted)) {
        await session.abortTransaction()
        return false
      }

      await session.commitTransaction()
      return true
    })
  }

  onRemoveData = async (req: Request, { useCode, useUserId, code }: Omit<OnStoreDataProps<unknown>, "data">): Promise<OnReturnServiceType<unknown>> => {

    let requiredRemoveType: OnSelectStoreType = {}

    if (useCode) {
      requiredRemoveType = {
        code
      }
    }

    else if (useUserId) {
      const user = await this.userService.getUser(req)

      if (user === null || isNull(user)) {
        return {
          isValid: false
        }
      }

      requiredRemoveType = {
        ownerOfDataTransfer: user._id
      }
    }

    const isTransactionValid = await useTransaction(async () => {
      return await Promise.all([
        CityModel.deleteMany(requiredRemoveType),
        TransporterModel.deleteMany(requiredRemoveType),
        SenderModel.deleteMany(requiredRemoveType),
        DestinationModel.deleteMany(requiredRemoveType)
      ])
    })

    return {
      isValid: !isNull(isTransactionValid),
      data: isTransactionValid
    }
  }
}