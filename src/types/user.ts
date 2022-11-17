import { Schema, model } from 'mongoose'

// Document interface for User
interface User {
    firstName: string,
    lastName: string,
    SSN: number,
    email: string,
    password: string,
    phoneNumber: number
}

// User schema
const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  SSN: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true }
})

// Export User
export default model<User>('user', userSchema)
