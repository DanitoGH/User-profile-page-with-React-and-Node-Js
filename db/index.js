const mongoose = require('mongoose')
const createError = require('http-errors')

const connectDB = async () => {
        return await mongoose.connect(process.env.MONGO_URI, 
        { useUnifiedTopology: true },
        { useNewUrlParser: true },
        { useCreateIndex: true },
        { useFindAndModify: false })
        .then(() => {
            console.log("Database connected....")
        })
       .catch((err) => {
            if (process.env.NODE_ENV !== 'production') {
                createError(500, 'Database connection error')
            }else {
                createError(500, 'Internal Server Error')
            }
       })
}

module.exports =  { connectDB }
