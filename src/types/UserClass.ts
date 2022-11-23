class User {
  private firstName: string
  private lastName: string
  private SSN: number
  private email: string
  private password: string
  private phoneNumber: number
  private token: string

  constructor(firstName: string, lastName: string, SSN: number, email: string, password: string, phoneNumber: number, token: string) {
    this.firstName = firstName,
    this.lastName = lastName,
    this.SSN = SSN,
    this.email = email,
    this.password = password,
    this.phoneNumber = phoneNumber,
    this.token = token
  }
}



export default User