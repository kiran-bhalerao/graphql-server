import * as bcrypt from 'bcryptjs'
import { User } from '../entity/User'

export const Mutation = {
  async register(parent: any, args: GQL.IRegisterOnMutationArguments) {
    const { email, password } = args

    const userExists = await User.findOne({ where: { email }, select: ['id'] })
    if (userExists)
      return [
        {
          path: 'register',
          message: 'Email already exists.'
        }
      ]

    const hash = await bcrypt.hash(password, 10)
    const user = User.create({
      email: email,
      password: hash
    })
    await user.save()
    return null
  }
}
