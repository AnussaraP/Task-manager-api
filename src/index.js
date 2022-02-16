const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log( 'Server is up on ports ' + port)
    if(!port)
    throw new Error('there is no port')
})



 //middleware function 
// app.use((req,res, next)=>{ 
//     const requests = ['GET','POST','PATCH','DELETE']   
//    if(requests.includes(req.method)){
//     res.status(503).send(`${req.method} REQ ARE DISABLED`)
//    }else{
//        next()
//    }
// })

///
// app.use((req,res, next)=>{
//     res.status(503).send('Site is curently down. check back soon!')

// })



//
//without middleware: new request (come in server) -> run route handler 
//with middleware: new request(come in to express server) -> do something (set up function run e.g. check valid auth token, prevent to run if no token etc.) -> run route handler 
//



//to see which user created which task, or which task belong to which user 
// const Tasks = require('./models/task')
// const User = require('./models/user')

//const main = async () => {
    //------find which user create the Task by Task ID 
    // const task = await Tasks.findById('6203ad3859e1e59fa71e7a52')
    // await task.populate('owner')     //converting task ID to see the owner of task  use ('owner')   or  ([{ path: 'owner' }])
    // console.log(task.owner)


    //user ID 
//    const user = await User.findById('6204f1d8ebb2257f807ce6fb')
//    if(!user) {
//        throw new Error('User not found')
//    }
//    await user.populate('tasks')
   
//    console.log(user.tasks)

// }
// main()


//////
// const pet = {
//     name:'Lewis'
// }
// pet.toJSON = function () {
//     console.log(this)
//     return {}
// }

// console.log(JSON.stringify(pet))

//----passworld--------
// const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     // const passworld = 'Red12345!'   
//     // const hasgedPasswold = await bcrypt.hash(passworld, 8)
//     // console.log(passworld)
//     // console.log(hasgedPasswold)

//     // const isMatch = await bcrypt.compare('Red12345!',hasgedPasswold)
//     // console.log(isMatch)

//     ///
//     const token = jwt.sign({_id: 'abc123'},'thisismynewcourse') //{expiresIn:'0 second'} json web token //expires in e.g. 2 days 
//     console.log(token)

//     const data = jwt.verify(token,'thisismynewcourse')
//     console.log(data)
// }
// myFunction()


