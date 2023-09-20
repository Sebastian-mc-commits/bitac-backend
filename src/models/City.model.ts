import { Schema, Types, model } from "mongoose";
import { ICity } from "../types";
import { ITypeWithIdAndUserOps } from "./ModelUtilities";

export interface ICityWithId extends ITypeWithIdAndUserOps, ICity { }
const schema = new Schema<ICityWithId>({
    name: {
        type: String,
        required: true
    },

    id: {
        type: Number,
        required: true
    }
})

export default model("cities", schema)