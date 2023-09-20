import { Schema, Types, model } from "mongoose";
import { ITransferredData } from "../types";

export interface ITransferredDataWithTransferredData extends ITransferredData {
  transferredData: unknown
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
          ref: "City",
          unique: true
        }
      ],

      senders: [
        {
          type: Types.ObjectId,
          ref: "Sender",
          unique: true
        }
      ],

      transporters: [
        {
          type: Types.ObjectId,
          ref: "Transporter",
          unique: true
        }
      ],

      destinations: [
        {
          type: Types.ObjectId,
          ref: "Destination",
          unique: true
        }
      ]
    },
    required: false
  }
})

export default model("data_transferred", schema)