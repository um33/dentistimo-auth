import User from '../models/UserModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// variables
const SALT_ROUNDS = 10

// create user function
async function createUser (firstName: string, lastName: string, SSN: string, email: string, password: string, confirmPassword: string, phoneNumber: string) {
  // validate user input
  console.log('kladdkaka1')
  if (!(email && password && firstName && lastName)) 
    return 'All input is required'
  
  console.log('kladdkaka2')
  // find existing user from DB
  const existingUsers = User.find({ email }) 
  
  console.log('kladdkaka3')
  // check if user already exists
  /*if (existingUsers.length > 0)
    return 'Email is already taken'
  */

  console.log('kladdkaka4')
    
  // check if passwords match
  if (password !== confirmPassword) 
    return('Passwords do not match')
    
  // encrypt provided password
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  
  console.log('kladdkaka5')
  
  // create the user
  const user = new User({firstName, lastName})

  console.log('kladdkaka6')
  console.log(user);
  
    
  // create token with an expire date of 2 hrs
  const token = jwt.sign(
    { user_id: user._id, email },
    'secret',
    {
      expiresIn: "2h",
    }
  )

  console.log('kladdkaka7')
  // save user token to created user
  
  return 'User has been created'
}

// login function
async function login (email: string, password: string): Promise<string>{
  // validate user input
  if (!(email && password )) 
    return 'All input is required'

  // Validate user input
  if (!(email && password)) {
    return "All input is required"
  }
  // Validate if user exist in our database
  const user = await User.findOne({ email })

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
  }
  return 'invalid Credential'
}

export default { createUser, login }