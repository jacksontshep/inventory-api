let products = [
    { id: '1', name: 'Laptop', description: 'A powerful laptop', price: 1200, quantity: 15 },
    { id: '2', name: 'Keyboard', description: 'A mechanical keyboard', price: 150, quantity: 50 },
    { id: '3', name: 'Mouse', description: 'An ergonomic mouse', price: 80, quantity: 30 }
]

async function routes(fastify, opts) {
    fastify.get('/products', async (request, reply) => {
        const instock = request.query.instock
        const price = request.query.price
        if (instock) {
            reply.send(products.filter(p => p.quantity >= 1))
        } else if (price) {
            reply.send(products.filter(p => p.price <= price))
        } else {
            reply.send(products)
        }
    })
    
    fastify.get('/products/:id', (request, reply) => {
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
    
    fastify.post('/products', options, (request, reply) => {
        const product = request.body
        const newid = Date.now().toString()
        product.id = newid
        products.push(product)
        reply.status(201).send(product)
    })
    
    fastify.put('/products/:id', options, (request, reply) => {
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
    
    fastify.delete('/products/:id', (request, reply) => {
            const id = request.params.id
            const product = products.find(p => p.id === id)
        if (product) {
            products.splice(products.indexOf(product), 1)
            reply.status(204).send()
        } else {
            reply.status(404).send({ error: 'Product not found' })
        }
    })

    fastify.patch('/products/:id', (request, reply) => {
        const id = request.params.id
        const product = products.find(p => p.id === id)
        if (product) {
            for (const key in request.body) {
                if (key in product) {
                    console.log(key)
                    product[key] = request.body[key]
                } else {
                    reply.status(400).send({ error: 'Invalid key' })
                }
            }
            reply.status(200).send(product)
        } else {
            reply.status(404).send({ error: 'Product not found' })
        }
    })
}

module.exports = routes
