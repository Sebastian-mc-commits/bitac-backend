import { Schema, model } from "mongoose";
import { IUser } from "../types";
import { getHashedPassword } from "../utils/functions";

const schema = new Schema<IUser>({
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
    }
})

schema.pre("save", async function (next: Function) {
    this.password = await getHashedPassword(this.password)

    return next()
})

export default model("users", schema)