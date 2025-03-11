const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => {
    const databaseParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    return mongoose.connect(process.env.DB_URL, databaseParams); // Return the promise from mongoose.connect
};