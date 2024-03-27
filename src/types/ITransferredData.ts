import { ObjectId } from "mongoose";

export default interface ITransferredData {
  code: string;
  transferredIn: Date;
}

export type ITransferredDataObject = {
  cities: ObjectId[];
  senders: ObjectId[];
  transporters: ObjectId[];
  destinations: ObjectId[];
}