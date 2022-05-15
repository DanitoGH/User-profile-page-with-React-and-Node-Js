const mongoose = require('mongoose')

const connectDB = async () => {
        return await mongoose.connect(process.env.MONGO_URI, 
        { useUnifiedTopology: true },
        { useNewUrlParser: true },
        { useCreateIndex: true },
        { useFindAndModify: false })
        .then(() => {
            console.log("Database connected....")
        })
       .catch((err) => console.log("Error:" + err.message))
}

module.exports =  { connectDB }