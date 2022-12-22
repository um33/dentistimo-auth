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
  client.subscribe('auth/#', { qos: 1 })
})

client.on('message', async (topic: string, message: Buffer) => {
  const parsedMessage = JSON.parse(message.toString())
  switch (topic) {
    case 'auth/user/create': {
      // call 'createUser' function
      const newUser = await user.createUser(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(newUser), {qos: 2})
      break
    }
    case 'auth/user/login': {
      // call 'login' function
      const loggedIn = await user.login(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(loggedIn), {qos: 2})
      break
    }
    case 'auth/user/return': {
      // call 'getUser' function
      const getUser = await user.getUser(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(getUser), {qos: 1})
      break
    }
    case 'auth/user/update': {
      // call 'updateUser' function
      const updateUser = await user.updateUser(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(updateUser), {qos: 1})
      break
    }
    case 'auth/user/delete': {
      // call 'deleteUser' function
      const deleteUser = await user.deleteUser(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(deleteUser), {qos: 2})
      break
    }
  }
})
