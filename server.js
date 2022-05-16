const express = require("express")
const { ApolloServer } = require('apollo-server-express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv")
const typeDefs = require("./graphql/types")
const resolvers = require("./graphql/resolvers")
const { connectDB } = require("./db")
dotenv.config()
const path = require("path")

const startServer = async () => {
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res })  // forwarding express request and response objects to context
    })

    await apolloServer.start()
     // middleware
    app.use(morgan("tiny"))
    app.use(cookieParser())

    apolloServer.applyMiddleware({
        app : app, 
        cors: {
            origin: true,
            credentials: true
        }
    })

    // serve static files from public folder in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static("public"))
        app.get('*', (req, res) => {
           res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
        })
    }

    // Init db connection 
    connectDB()

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}
// startServer
startServer()
