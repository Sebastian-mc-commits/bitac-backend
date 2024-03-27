import { Schema, model, Types } from "mongoose";
import { IDestination } from "../types";
import { ITypeWithIdAndUserOps } from "./ModelUtilities";

export interface IDestinationWithId extends ITypeWithIdAndUserOps, IDestination { }

const schema = new Schema<IDestinationWithId>({
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

  senderId: {
    required: true,
    type: String
  },

  id: {
    type: Number,
    required: false
  }
})

export default model("destinations", schema)