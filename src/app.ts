import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
dotenv.config()

const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')

client.on('connect', () => {
  client.subscribe ('auth/create/user')
  client.subscribe ('auth/login/user')
  client.subscribe ('auth/getall/users')
  client.subscribe ('auth/update/users')
  client.subscribe ('auth/delete/user')
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'auth':
      // eslint-disable-next-line no-console
      console.log(message.toString())
      client.end()
      break
    case 'auth/create/user':
      // call createUser function
      break
    case 'auth/login/user':
      // call loginUser function
      break
    case 'auth/getall/users':
      // call getAllUsers function
      break
    case 'auth/update/user':
      // call updateUser function
      break
    case 'auth/delete/user':
      // call deleteUser function
      break
  }
})
