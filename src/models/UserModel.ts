import mongoose, { Schema } from "mongoose"

// Define user schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  SSN: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true }
})
  
// Export User
export default mongoose.model('user', userSchema)