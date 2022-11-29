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
  client.subscribe ('auth/create/user')
  client.subscribe ('auth/login/user')
  client.subscribe ('auth/update/users')
  client.subscribe ('auth/delete/user')
  client.publish ('auth/create/user', 'haloo')
})

client.on('message', async (topic, message) => {
  switch (topic) {
    case 'auth':
      // eslint-disable-next-line no-console
      console.log(message.toString())
      client.end()
      break
    case 'auth/create/user':
      // call createUser function
      user.createUser('victor', 'campanello', '123456789', 'druner@gmail.com', 'Password123', 'Password123', '123456789')
      // eslint-disable-next-line no-console
      break
    case 'auth/login/user':
      // call loginUser function
      // eslint-disable-next-line no-console
      console.log("testing mqtt")
      break
    case 'auth/update/user':
      // call updateUser function
      // eslint-disable-next-line no-case-declarations
      const updateUser = await user.updateUser(message.toString())
      client.publish('gateway/user/create', JSON.stringify(updateUser))
      break
    case 'auth/delete/user':
      // call deleteUser function
      break
  }
})
