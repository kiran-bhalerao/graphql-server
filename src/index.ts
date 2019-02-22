import 'reflect-metadata'
import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { resolvers } from './resolvers'
import * as path from 'path'
import { createTypeormConn } from './utils/createTypeormConn'
import Redis from 'ioredis'

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, './schema.graphql'))
  const redis = new Redis()
  const server = new GraphQLServer({ typeDefs, resolvers, context: { redis } })

  await createTypeormConn()
  await server.start()
  console.log('Server is running on localhost:4000')
}

startServer()
