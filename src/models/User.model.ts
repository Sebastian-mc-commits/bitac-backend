import { Schema, Types, model } from "mongoose";
import { IUser } from "../types";
import { getHashedPassword } from "../utils/functions";
import { ITransferredDataObject } from "../types/ITransferredData";

export interface IUserWithTransferredData extends IUser {
    transferredData: ITransferredDataObject
}

const schema = new Schema<IUserWithTransferredData>({
    email: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
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

schema.pre("save", async function (next: Function) {
    this.password = await getHashedPassword(this.password)

    return next()
})

export default model("users", schema)