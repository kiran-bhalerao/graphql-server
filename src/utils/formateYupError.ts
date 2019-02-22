import { ValidationError } from 'yup'

export const formateYupError = (err: ValidationError) => {
  const error: Array<{ path: string; message: string }> = err.inner.map(e => ({
    path: e.path,
    message: e.message
  }))

  return error
}
