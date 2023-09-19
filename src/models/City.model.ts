import { Schema, model } from "mongoose";
import { ICity } from "../types";

const schema = new Schema<ICity>({
    name: {
        type: String,
        required: true
    }
})

export default model("cities", schema)