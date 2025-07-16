const server = require('fastify')({
    logger: true
})

server.register(require('./productRoutes'))
server.register(require('./foodRoutes'))

const start = async () => {
    try {
      await server.listen({ port: 3001 })
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
}

start()
