import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// variable declarations
const SALT_ROUNDS = 10

// create user from passed in data
async function createUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const {
      firstName,
      lastName,
      SSN,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = userInfo

    // validate user input
    if (!(firstName && lastName && SSN && email && password && phoneNumber))
      return 'All input is required'

    // find existing user from DB
    const existingUsers = User.find({ email })

    // check if user already exists
    if ((await existingUsers).length > 0) return 'Email is already taken'

    // check if passwords match
    if (password !== confirmPassword) return 'Passwords do not match'

    // encrypt provided password
    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // create new user
    const user = new User({
      firstName,
      lastName,
      SSN,
      email,
      password: encryptedPassword,
      phoneNumber,
    })

    // create token with an expire date of 2 hrs
    const token = jwt.sign({ user_id: user._id, email }, 'secret', {
      expiresIn: '2h',
    })

    // save user token to created user
    user.save()

    // eslint-disable-next-line no-console
    console.log(user, token)

    // save new user to DB
    return { ...user._doc, token }
  } catch {
    return 'Something went wrong'
  }
}

// user login
async function login(message: string) {
  const userInfo = JSON.parse(message)
  const { email, password } = userInfo

  // Validate user input
  if (!(email && password)) {
    return 'All input is required'
  }

  // Validate if user exist in our database
  const user = await User.findOne({ email })
  if (!user) {
    return 'invalid credential'
  }

  // if user exists and passwords match, then create and assign user token
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign({ user_id: user._id, email }, 'secret', {
      expiresIn: '2h',
    })

    // save user token
    return { ...user._doc, token }
  }
}

// return user with a specific ID
async function getUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const userID = userInfo.userid
    const user = await User.findById(userID)

    if (!user) {
      // eslint-disable-next-line no-console
      console.log('Invalid user ID')
      return 'Invalid user ID'
    }

    if (user === null) {
      // eslint-disable-next-line no-console
      console.log('User does not exist')
      return 'User does not exist'
    }

    // eslint-disable-next-line no-console
    console.log(user)
    return user
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  }
}

// delete user with a specific ID
async function deleteUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const id = userInfo
    const user = await User.findOneAndDelete(id)

    if (!user) {
      return 'Invalid id'
    }

    if (user === null) {
      return 'User does not exist'
    }

    // eslint-disable-next-line no-console
    console.log(user)
    return 'User has been deleted'
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  }
}

// updates a user given the ID
async function updateUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const userID = userInfo.userid.userID
    const user = await User.findById(userID)

    if (user != null) {
      user.firstName = userInfo.userid.firstName
      user.lastName = userInfo.userid.lastName
      user.SSN = userInfo.userid.SSN
      user.email = userInfo.userid.email
      user.password = userInfo.userid.password
      user.phoneNumber = userInfo.userid.phoneNumber
    }

    if (!user) {
      return 'Invalid id'
    }

    if (user === null) {
      return 'User does not exist'
    }

    // eslint-disable-next-line no-console
    console.log(user)
    user.save()
    return user.id
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  }
}

// export funtions
export default { createUser, login, getUser, deleteUser, updateUser }
