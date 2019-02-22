import * as bcrypt from 'bcryptjs'
import { User } from '../entity/User'
import * as yup from 'yup'
import { formateYupError } from '../utils/formateYupError'
import {
  ALREADY_EMAIL,
  INVALID_EMAIL,
  PASSWORD_GREATER_THAN
} from '../utils/errorTypes'
import { createConfirmEmailLink } from '../utils/createConfirmEmailLink'

const scheme = yup.object().shape({
  email: yup.string().email(INVALID_EMAIL),
  password: yup.string().min(3, PASSWORD_GREATER_THAN)
})

export const Mutation = {
  async register(
    parent: any,
    args: GQL.IRegisterOnMutationArguments,
    { redis, url }: any
  ) {
    const { email, password } = args

    try {
      await scheme.validate(args, { abortEarly: false })
    } catch (err) {
      return formateYupError(err)
    }

    const userExists = await User.findOne({ where: { email }, select: ['id'] })
    if (userExists)
      return [
        {
          path: 'register',
          message: ALREADY_EMAIL
        }
      ]

    const hash = await bcrypt.hash(password, 10)
    const user = User.create({
      email: email,
      password: hash
    })
    await user.save()
    const link = await createConfirmEmailLink(url, user.id, redis)
    return null
  }
}
