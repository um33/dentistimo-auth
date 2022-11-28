import User from '../models/UserModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInterface } from '../types/UserInterface'

// variable declarations
const SALT_ROUNDS = 10

// create user function
async function createUser (message:string) {
  const userInfo = JSON.parse(message)
  const {firstName, lastName, SSN, email, phoneNumber , password, confirmPassword} = userInfo
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
  const user = new User({firstName, lastName, SSN, email, password: encryptedPassword, phoneNumber}) as unknown as UserInterface
    
  // create token with an expire date of 2 hrs
  const token = jwt.sign(
    { user_id: user._id, email },
    'secret',
    {
      expiresIn: "2h",
    }
  )

  // save user token to created user
  await user.save()
  // eslint-disable-next-line no-console
  console.log(user, token)
  // save new user to DB
  return {...user._doc, token}
}

// login function
async function login(message:string) {
  const userInfo = JSON.parse(message)
  const{email, password} = userInfo
  
  // Validate user input
  if (!(email && password)) {
    return ('All input is required')
  }

  // Validate if user exist in our database
  const user = await User.findOne({ email })
  if(!user){
    return'invalid credential'
  }

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
    return {...user, token}
  }
}

// export funtions
export default { createUser, login }