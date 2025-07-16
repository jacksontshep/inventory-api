let products = [
    { id: '10', name: 'Burger', description: 'A delicious burger', price: 5, quantity: 100 },
    { id: '20', name: 'Pizza', description: 'A delicious pizza', price: 10, quantity: 50 },
    { id: '30', name: 'Soda', description: 'A refreshing soda', price: 2, quantity: 100 }
]

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, opts) {
    fastify.get('/food', async (request, reply) => {
        reply.send(products)
    })
    
    fastify.get('/food/:id', (request, reply) => {
        const id = request.params.id
        const product = products.find(p => p.id === id)
        if (product) {
            reply.send(product)
        } else {
            reply.status(404).send({ error: 'Product not found' })
        }
    })
    
    const options = {
        schema: {
            body: {
                type: 'object',
                required: ['name', 'description', 'price', 'quantity'],
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    quantity: { type: 'number' }
                }
            }
        }
    }
    
    fastify.post('/food', options, (request, reply) => {
        const product = request.body
        const newid = Date.now().toString()
        product.id = newid
        products.push(product)
        reply.status(201).send(product)
    })
    
    fastify.put('/food/:id', options, (request, reply) => {
        const id = request.params.id
        const product = products.find(p => p.id === id)
        if (product) {
            const updatedProduct = request.body
            updatedProduct.id = id
            const index = products.indexOf(product)
            products[index] = updatedProduct
            reply.status(200).send(updatedProduct)
        } else {
            reply.status(404).send({ error: 'Product not found' })
        }
    })
    
    fastify.delete('/food/:id', (request, reply) => {
            const id = request.params.id
            const product = products.find(p => p.id === id)
        if (product) {
            products.splice(products.indexOf(product), 1)
            reply.status(204).send()
        } else {
            reply.status(404).send({ error: 'Product not found' })
        }
    })
}

module.exports = routes
