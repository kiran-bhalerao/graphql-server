import 'reflect-metadata'
import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { resolvers } from './resolvers'
import * as path from 'path'
import { createTypeormConn } from './utils/createTypeormConn'
import Redis from 'ioredis'
import { User } from './entity/User'

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, './schema.graphql'))
  const redis = new Redis()
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host')
    })
  })

  // express route
  server.express.get('/confirm/:id', async (req, res) => {
    const { id } = req.params
    const userId: any = await redis.get(id)

    if (userId) {
      User.update({ id: userId }, { confirmed: true })
      res.send({ success: true, message: 'Email is verified.' })
    } else {
      res.send({ success: false, message: 'Invalid invitation link.' })
    }
  })
  await createTypeormConn()
  await server.start()
  console.log('Server is running on localhost:4000')
}

startServer()
