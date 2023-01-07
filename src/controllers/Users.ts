import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'

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
    if (!(firstName && lastName && SSN && email && password && phoneNumber)) {
      throw new MQTTErrorException({
        code: 400,
        message: 'All input is required',
      })
    }
    // find existing user from DB
    const existingUsers = User.find({ email })

    // check if user already exists
    if ((await existingUsers).length > 0) {
      throw new MQTTErrorException({
        code: 400,
        message: 'Email is already taken',
      })
    }
    // check if passwords match
    if (password !== confirmPassword) {
      throw new MQTTErrorException({
        code: 400,
        message: 'Passwords do not match',
      })
    }
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

    // save new user to DB
    return { ...user._doc, token }
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

// user login
async function login(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const { email, password } = userInfo
    // Validate user input
    if (!(email && password)) {
      throw new MQTTErrorException({
        code: 400,
        message: 'All input is required',
      })
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email })
    if (!user) {
      throw new MQTTErrorException({
        code: 401,
        message: 'invalid credential',
      })
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
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

// return user with a specific ID
async function getUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const userID = userInfo.userid
    const user = await User.findById(userID)

    if (!user) {
      throw new MQTTErrorException({
        code: 400,
        message: 'Invalid user ID',
      })
    }

    if (user === null) {
      throw new MQTTErrorException({
        code: 400,
        message: 'User does not exist',
      })
    }

    return user
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

// delete user with a specific ID
async function deleteUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const id = userInfo.userid
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      throw new MQTTErrorException({
        code: 400,
        message: 'Invalid id',
      })
    }

    if (user === null) {
      throw new MQTTErrorException({
        code: 400,
        message: 'User does not exist',
      })
    }

    return 'User has been deleted'
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

// updates a user given the ID
async function updateUser(message: string) {
  try {
    const userInfo = JSON.parse(message)
    const userID = userInfo.userid.userID
    const user = await User.findById(userID)

    const encryptedPassword = await bcrypt.hash(
      userInfo.userid.password,
      SALT_ROUNDS
    )

    if (user != null) {
      user.firstName = userInfo.userid.firstName
      user.lastName = userInfo.userid.lastName
      user.SSN = userInfo.userid.SSN
      user.email = userInfo.userid.email
      user.password = encryptedPassword
      user.phoneNumber = userInfo.userid.phoneNumber
    }

    if (!user) {
      throw new MQTTErrorException({
        code: 400,
        message: 'Invalid id',
      })
    }
    if (user === null) {
      throw new MQTTErrorException({
        code: 400,
        message: 'User does not exist',
      })
    }

    user.save()
    return user.id
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

async function verifyToken(message: string) {
  try {
    const parsed = JSON.parse(message)
    const token = parsed.token
    const decoded = jwt.verify(token, 'secret')
    return decoded
  } catch (error) {
    return error
  }
}

// export funtions
export default { createUser, login, getUser, deleteUser, updateUser, verifyToken }
