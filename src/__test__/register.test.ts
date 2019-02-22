import { request } from 'graphql-request'
import { User } from '../entity/User'
import { createTypeormConn } from '../utils/createTypeormConn'
import {
  ALREADY_EMAIL,
  INVALID_EMAIL,
  PASSWORD_GREATER_THAN
} from '../utils/errorTypes'

beforeAll(async () => {
  await createTypeormConn()
})

describe('register the user', () => {
  const email = 'kiran35@example.com'
  const password = 'kiran123'

  const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}",password: "${p}") {
      path
      message
    }
  }
  `

  it("register's email with hashed password", async () => {
    const responce = await request(
      'http://localhost:4000',
      mutation(email, password)
    )
    expect(responce).toEqual({ register: null })
    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)
    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)
  })

  it('will handle the error if we try to register with same email', async () => {
    const responce: any = await request(
      'http://localhost:4000',
      mutation(email, password)
    )
    expect(responce.register[0].path).toEqual('register')
    expect(responce.register[0].message).toContain(ALREADY_EMAIL)
  })

  it('tests for bad email', async () => {
    const responce: any = await request(
      'http://localhost:4000',
      mutation('bad.com', password)
    )
    expect(responce.register[0].path).toEqual('email')
    expect(responce.register[0].message).toContain(INVALID_EMAIL)
  })

  it('tests for bad password', async () => {
    const responce: any = await request(
      'http://localhost:4000',
      mutation(email, 'a')
    )
    expect(responce.register[0].path).toEqual('password')
    expect(responce.register[0].message).toContain(PASSWORD_GREATER_THAN)
  })
})
