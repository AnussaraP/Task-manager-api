const  mongoose  = require("mongoose")
//const validator = require('validator')


const tasksSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true, 
        trim: true
       
    },
    completed:{
        type:Boolean,
        default: false 
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,  //this type is object ID 
        required: true, 
        ref:'User'   //model name to create relationship 
    }
},{
    timestamps: true 
})



const Tasks = mongoose.model('Tasks', tasksSchema)


module.exports = Tasks

