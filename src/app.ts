import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
dotenv.config()

const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')

client.on('connect', () => {
  client.subscribe('auth', (err) => {
    if (!err) {
      client.publish('auth', 'Hello mqtt, this is auth server speaking!')
    }
  })
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
