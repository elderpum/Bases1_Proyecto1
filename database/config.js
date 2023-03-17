
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        console.log('Database connected')

    } catch (error) {
        console.error(error)
        throw new Error('Error when connecting to database')
    }
}


module.exports = {
    dbConnection
}