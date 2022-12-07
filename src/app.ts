import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import user from './controllers/Users'
import mongoose, { ConnectOptions } from 'mongoose'

dotenv.config()

// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/users'
const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } else if(process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
    }
  }
)

client.on('connect', () => {
  client.subscribe('auth/user/create')
  client.subscribe('auth/user/login')
  client.subscribe('auth/user/return')
  client.subscribe('auth/user/update')
  client.subscribe('auth/user/delete')
})

client.on('message', async (topic: string, message: Buffer) => {
  switch (topic) {
    case 'auth/user/create': {
      // call 'createUser' function
      const newUser = await user.createUser(message.toString())
      client.publish('gateway/user/create', JSON.stringify(newUser))
      break
    }
    case 'auth/user/login': {
      // call 'login' function
      const loggedIn = await user.login(message.toString())
      client.publish('gateway/user/login', JSON.stringify(loggedIn))
      break
    }
    case 'auth/user/return': {
      // call 'getAUser' function
      const getUser = await user.getUser(message.toString())
      client.publish('gateway/user/return', JSON.stringify(getUser))
      break
    }
    case 'auth/user/update': {
      // call 'updateUser' function
      const updateUser = await user.updateUser(message.toString())
      client.publish('gateway/user/update', JSON.stringify(updateUser))
      break
    }
    case 'auth/user/delete': {
      // call 'deleteUser' function
      const deleteUser = await user.deleteUser(message.toString())
      client.publish('gateway/user/delete', JSON.stringify(deleteUser))
      break
    }
  }
})
