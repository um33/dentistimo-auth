import User from '../models/UserModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'

// variable declarations
const SALT_ROUNDS = 10

// create user function
async function createUser (firstName: string, lastName: string, SSN: string, email: string, password: string, confirmPassword: string, phoneNumber: string) {
  // validate user input
  if (!(firstName && lastName && SSN && email && password)) 
    return 'All input is required'
  
  // find existing user from DB
  const existingUsers = User.find({ email }) 
  
  // check if user already exists
  if ((await existingUsers).length > 0)
    return 'Email is already taken'
    
  // check if passwords match
  if (password !== confirmPassword) 
    return('Passwords do not match')
    
  // encrypt provided password
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    
  // create new user
  const user = new User({firstName, lastName, SSN, email, password: encryptedPassword, phoneNumber})  
    
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

  // save new user to DB
  user.save()
  return 'User has been created'
}

// login function
async function login(email: string, password: string) {
  
  // Validate user input
  if (!(email && password)) {
    return ('All input is required')
  }

  // Validate if user exist in our database
  const user = await User.findOne({ email })

  // if user exists and passwords match, then create and assign user token
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      'secret',
      {
        expiresIn: "2h",
      }
    )

    // save user token
    user.token = token
  }}

// update user
async function updateUser(message:string){
  const userInfo = JSON.parse(message)
  const {firstName, lastName, email, phoneNumber, _id} = userInfo
  try {
    const toUpdate = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      { new: true }
    ) as Document
    const updatedUser = await toUpdate.save()
    return updatedUser
  } catch (err) {
    return err
  }
}

// export funtions
export default { createUser, login, updateUser }