import { Schema, model, Types } from "mongoose";
import { ISender } from "../types";
import { ITypeWithIdAndUserOps } from "./ModelUtilities";

export interface ISenderWithId extends ITypeWithIdAndUserOps, ISender { }

const schema = new Schema<ISenderWithId>({
  cityId: {
    required: true,
    type: Number
  },

  nit: {
    required: true,
    type: String
  },

  phoneNumber: {
    required: true,
    type: String
  },

  locationDescription: {
    required: true,
    type: String
  },

  name: {
    required: true,
    type: String
  },

  transporterId: {
    required: true,
    type: Number
  },

  id: {
    type: Number,
    required: false
  }
})

export default model("senders", schema)