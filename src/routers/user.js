const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelationEmail}=require('../emails/account')

const router = new express.Router()

//Createing new User
router.post('/users', async(req, res)=>{
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})
//login
router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user:user,token })
    }catch(e){
        res.status(400).send({Error:' incorect email or password'})
        console.log(e)

    }

})
//logout 
router.post('/users/logout', auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token //if token isnt match to the one we use, if it isnt match = then return true. 

        })
        await req.user.save()   //call save() 

        res.send()   //if things went well, send request back 200
        
    } catch (e) {
        res.status(500).send()   //if things didnt go well, send 500 
        
    }
})
//logout all users 
router.post('/users/logoutAll', auth, async (req,res)=> {
   try{
       req.user.tokens = []
       await req.user.save()
       res.send()

   }catch(e){
       res.status(500).send()

   }
})

//getting all users
router.get('/users',auth, async (req,res)=>{
    try {
        const user = await User.find()
        res.send(user)

    } catch(e){
        res.status(500).send(e)
        }
})

//getting user profile      //view profile after autheticated 
router.get('/users/me',auth, async (req,res)=>{
    res.send(req.user)
})
//getting 1 user by ID
// router.get('/users/:id', async(req,res)=>{
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send(e)
//         }
//         res.send(user)

//     } catch(e){
//         res.status(500).send(e)
//     }
// })

//Updating data user by ID
router.patch('/users/me', auth, async (req,res)=>{
    const updates = Object.keys(req.body)       //Object.keys() =>>>  object is req.body , then keys will return strings 
    const allowUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((update)=> allowUpdates.includes(update)) //this was callback function, and  {return allowUpdates.includes(update) )}

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})     
    }
    try{
        //const user = await User.findById(req.user._id)
        updates.forEach((update) => {       //forEach => for each element in array, updates ==>> is array of string, update ==>> is string
            req.user[update] = req.body[update]
        })

        await req.user.save() //middleware is going to get executed here
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators:true })
       
        res.send(req.user)
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})
//deleting user by ID
router.delete('/users/me', auth, async(req, res)=>{

try {
    // const user = await User.findByIdAndDelete(req.user._id)
    // if(!user){
    //     return res.status(404).send()
    // }
    await req.user.remove()
    sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user)

} catch (e) {
    res.status(500).send()   
}

})

//upload avatar 
const upload = multer({
    //dest: 'avatar',
    limits:{
        fileSize: 1000000
    }, 
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload .jpg, .jpeg .png file only'))
        }
        cb(undefined,true)
        
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('avatar uploaded')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('avatar deleted')
})

//access profile picture by ID
router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('There is no user or avatar')
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }
    catch(e){
        res.status(400).send()

    }

})

module.exports = router
