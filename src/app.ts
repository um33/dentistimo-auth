import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import user from './controllers/Users'
import mongoose, { ConnectOptions } from 'mongoose'

dotenv.config()

// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/authDB'
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
  client.subscribe('auth/users/getall')
  client.subscribe('auth/users/update')
  client.subscribe('auth/user/delete')
})

client.on('message', async (topic: string, message:Buffer) => {
  switch (topic) {
    case 'auth':
      // eslint-disable-next-line no-console
      console.log(message.toString())
      client.end()
      break
    case 'auth/user/create': {
      // call createUser function
      const newUser = await user.createUser(message.toString())
      console.log(newUser)
      client.publish('gateway/user/create', JSON.stringify(newUser))
      // eslint-disable-next-line no-console
      break
    }
    case 'auth/user/login': 
      // call loginUser function
      // eslint-disable-next-line no-console
      console.log('testing mqtt')
      break
    case 'auth/users/all':
      // call getAllUsers function
      break
    case 'auth/user/update':
      // call updateUser function
      break
    case 'auth/user/delete':
      // call deleteUser function
      break
  }
})
