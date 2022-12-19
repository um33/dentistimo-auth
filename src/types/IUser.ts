import mongoose, { Document } from "mongoose"

export interface IUser extends Document{
  _id: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  SSN: string
  email: string
  password: string
  phoneNumber: string
  _doc?: Record<string, unknown>
}