class User {
  private firstName: string
  private lastName: string
  private SSN: string
  private email: string
  private password: string
  private phoneNumber: number
  private token: string

  constructor(firstName: string, lastName: string, SSN: string, email: string, password: string, phoneNumber: number, token: string) {
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