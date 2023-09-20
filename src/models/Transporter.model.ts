import { Schema, model } from "mongoose";
import { ITransporter } from "../types";
import { ITypeWithIdAndUserOps } from "./ModelUtilities";

export interface ITransporterWithId extends ITypeWithIdAndUserOps, ITransporter { }

const schema = new Schema<ITransporterWithId>({

  name: {
    type: String,
    required: true
  },

  id: {
    type: Number,
    required: true
  }
})

export default model("transporters", schema)