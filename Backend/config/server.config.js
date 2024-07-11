require('dotenv').config()

const config = {
    appPort : process.env.PORT,
    appKey : process.env.GEM_KEY,
    mongoUri : process.env.MONGO_URI
}

module.exports = {
    config
}
