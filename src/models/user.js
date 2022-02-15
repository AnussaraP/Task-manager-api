const  mongoose  = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require("./task")

const userSchema = new mongoose.Schema({    //middleweare    
    name:{
        type: String,
        required: true,
        trim: true,    //removed spaces
        
    },

    age: {
        type: Number,
        default:0,      //if frogot provide age, this will set to 0. 
        validate(value) {      //set-up validation e.g. age between 18-99 only 
            if(value < 0) {
                throw new Error('Age must be a possitive number')
            }
        }
    },
    email: {
        type: String,
        unique: true, //email needs to be unique, cant use same email
        trim: true,
        lowercase: true,
        require:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('This email is invalid')
            }
        }
    },
    password:{
        type:String,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('The password must include: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1')
            }
        }
    },
    tokens:[{       
        token:{
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
    
},{
timestamps:true
})


userSchema.virtual('tasks',{      //virtual allow to set up virtual attributes, this wont store in the doccument or database 
    ref:'Tasks',   //same name as task.js/models when export 
    localField:'_id',  //user ID
    foreignField:'owner'     //Task owner 
})


userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject() 

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject 
}

//generate token 
userSchema.methods.generateAuthToken = async function () {
    const user = this 

    const token = jwt.sign({_id: user._id.toString() },process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token}) //tokens userSchema above
    await user.save() //save to database 

    return token 
}

//make sure passworld and email must be the same when login. 
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//Hash the plain text passworld before saving 
userSchema.pre('save', async function (next) {     //set up middleware //**standing function to bind this */
    const user = this 

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)

    }

    next() 
})

//delete user tasks when user is removed 
userSchema.pre('remove', async function (next) {
    const user = this 
    const owner = user._id
    await Tasks.deleteMany({owner})

    next()
})


const User = mongoose.model('User',userSchema) 
module.exports = User