import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import user from './controllers/Users'
import mongoose from 'mongoose'

dotenv.config()

// Variables
const mongoURI = 'mongodb://localhost:27017/authDB'
const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')

// Connect to MongoDB



client.on('connect', () => {
  client.subscribe ('auth/user/create')
  client.subscribe ('auth/user/login')
  client.subscribe ('auth/users/getall')
  client.subscribe ('auth/users/update')
  client.subscribe ('auth/user/delete')
})

client.on('message', (topic:string, message:string) => {
  switch (topic) {
    case 'auth':
      // eslint-disable-next-line no-console
      console.log(message.toString())
      client.end()
      break
    case 'auth/user/create':
      // call createUser function
      // eslint-disable-next-line no-console
      console.log(message)
      user.createUser(message)
      // eslint-disable-next-line no-console
      break
    case 'auth/user/login':
      // call loginUser function
      // eslint-disable-next-line no-console
      console.log("testing mqtt")
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
