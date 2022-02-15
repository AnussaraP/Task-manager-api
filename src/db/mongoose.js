const  mongoose  = require("mongoose")
// //const validator = require('validator')


console.log('connecting...')
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('now connected')
}).catch((err) => {
    console.error('Could not connect to database', err)
})

