const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')  //middleware function 1stly looking for header that the user is supposed to provide/ replace.('ok','') => replace ok with '' or nothing
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //then validates that header 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //and finds the associated user from here its call next() or given error 
        console.log(token)
    if(!user){
        throw new Error()
    }

    req.token = token
    req.user = user
    next()

    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
        console.log(e)
    }


}

module.exports = auth