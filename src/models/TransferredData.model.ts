import { Schema, Types, model } from "mongoose";
import { ITransferredData } from "../types";
import { ITransferredDataObject } from "../types/ITransferredData";

export interface ITransferredDataWithTransferredData extends ITransferredData {
  transferredData: ITransferredDataObject
}

const schema = new Schema<ITransferredDataWithTransferredData>({
  code: {
    type: String,
    required: true,
    unique: true
  },

  transferredIn: {
    type: Date,
    required: true
  },

  transferredData: {
    type: {
      cities: [
        {
          type: Types.ObjectId,
          ref: "cities",
          unique: true
        }
      ],

      senders: [
        {
          type: Types.ObjectId,
          ref: "senders",
          unique: true
        }
      ],

      transporters: [
        {
          type: Types.ObjectId,
          ref: "transporters",
          unique: true
        }
      ],

      destinations: [
        {
          type: Types.ObjectId,
          ref: "destinations",
          unique: true
        }
      ]
    },
    required: false
  }
})

export default model("data_transferred", schema)