export class MQTTErrorException extends Error {
  code: number
  constructor({ message, code }: { message: string; code: number }) {
    super(message)
    this.name = 'MQTTErrorException'
    this.code = code
  }
}
