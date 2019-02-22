import { getConnectionOptions, createConnection } from 'typeorm'

export const createTypeormConn = async () => {
  const connectionOpt = await getConnectionOptions(process.env.NODE_ENV)
  return createConnection({ ...connectionOpt, name: 'default' })
}
