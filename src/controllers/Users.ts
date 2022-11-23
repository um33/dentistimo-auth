import User from '../models/UserModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// variables
const SALT_ROUNDS = 10

// create user function
async function createUser (firstName: string, lastName: string, SSN: string, email: string, password: string, confirmPassword: string, phoneNumber: number):Promise<string> {
  // validate user input
  if (!(email && password && firstName && lastName)) 
    return 'All input is required'
    
  // find existing user from DB
  const existingUsers = await User.find({ email }) 
    
  // check if user already exists
  if (existingUsers.length > 0) 
    return 'Email is already taken'
    
  // check if passwords match
  if (password !== confirmPassword) 
    return('Passwords do not match')
    
  // encrypt provided password
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    
  // create the user
  const user = await User.create({
    firstName,
    lastName,
    SSN,
    email,
    encryptedPassword,
    phoneNumber
  })
    
  // create token with an expire date of 2 hrs
  const token = jwt.sign(
    { user_id: user._id, email },
    'secret',
    {
      expiresIn: "2h",
    }
  )

  // save user token to created user
  user.token = token
  await user.save()
  return 'User has been created'
}

export default { createUser }