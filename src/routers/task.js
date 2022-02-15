const express = require('express')
const Tasks = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//creating a new task
router.post('/tasks',auth,async (req,res)=>{
    //const tasks = new Tasks(req.body)

    const tasks = new Tasks({
        ...req.body,    //s6 spread operaor: ... copy all of the properties from body over this this project, copy description and completed value of tasks. 
        owner: req.user._id
    })

    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch(e){
        res.status(400).send(e)

    }
})

//GET all tasks   or /tasks?completed=true => show the one that completed 
//GET /tasks?limit=10&skip=10        //limit and skip pages for pagination 
//GET /tasks?sortby=CreateAt:desc    // sotby field e.g asc or desc 
router.get('/tasks', auth, async (req,res)=>{
    const match = { }
    const sort = { }
    //

    if(req.query.completed){
        match.completed = req.query.completed === 'true'     //set uo completed to String, convert boolean to string 
        //if completed String 'True' = to String 'True' === the completed will be true 
        //if String not equal to 'True', this will be false 
        // URL: {{url}}/tasks/?completed=true    ===bcoz true is string, so this needs to convert boolean to string like above 
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1  //this is terbary operator: has 3 pieces in one 

    }



    try{
        await req.user.populate({
            path:'tasks',   //customise objects 
            match, //option, only going to get tasks that already completed or not completed. 
            options:{     //limit and skip 
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort 
            }

        })
        res.send(req.user.tasks)
        //-----or 
        //const tasks = await Tasks.findOne({ owner:req.user._id})
        //res.send(tasks)

    } catch(e){
        res.status(500).send(e)
    }

})

//reading 1 task by ID
router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try {
       // const tasks = await Tasks.findById(_id)
        const tasks = await Tasks.findOne({_id, owner:req.user._id })   //find by task ID or owner ID 
       
        if(!tasks){
            return res.status(404).send()
            
        }
        res.send(tasks)
        

    } catch(e){
        res.status(500).send(e)
        
        

    }
})

//Updating Data for Task by ID
router.patch('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id 
    const owner = req.user._id
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowUpdates.includes(update))
       
    if(!isValidOperation){
            return res.status(400).send({error: 'The update is invalid!'})
        }
        try{
        const tasks = await Tasks.findOne({_id, owner})

        if(!tasks){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            tasks[update] = req.body[update]
        })  
        await tasks.save()

        res.send(tasks)
    }catch(e){
        res.status(400).send(e)

    }

})
//delete a task by ID
router.delete('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id 
    const owner = req.user._id
     try {
        const tasks =  await Tasks.findByIdAndDelete({_id, owner})
        if(!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
         
     } catch (e) {
         res.status(500).send()
        
         
     }

})

module.exports = router
