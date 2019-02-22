import { Redis } from 'ioredis'

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        redis: Redis
        url: string
      },
      info: any
    ) => any
  }
}

// export interface ResolverContext {
//   redis: Redis
// }
