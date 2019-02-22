import { v4 } from 'uuid'
import { Redis } from 'ioredis'

export const createConfiremEmailLink = (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4()
}
