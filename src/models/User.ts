import mongoose from "mongoose"
import { IUser } from "../types/IUser"

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  SSN: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: false },
})
  
// Export User
export default mongoose.model<IUser>('user', userSchema)