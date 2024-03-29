const asyncHandler = require('express-async-handler')

const Goal =require('../models/goalModel')
const User =require('../models/userModel')
// @desc Get goals
// @route GET /api/goals
// @access private
const getGoals =asyncHandler( async(req,res)=>{
  const goals = await Goal.find({ user:req.user.id })
    res.status(200).json(goals)
}
) 


// @desc set goals
// @route POST /api/goals
// @access private
const setGoal =asyncHandler(  async(req,res)=>{
    const data = req.body.text
    if (!data) {
        res.status(400)
        throw new Error('please add a text filed')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
}
)
// @desc update goal
// @route PUT /api/goals/:id
// @access private
const updateGoal =asyncHandler( async(req,res)=>{
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
         res.status(400)
         throw new Error ('Goal not found')
    }
    const user  = await User.findById(req.user.id)
   
    // check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the  logged in user matche r the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('user not authorized')
    }

    const updatedGoal =await Goal.findByIdAndUpdate(req.params.id, req.body,{new: true,})
    res.status(200).json(updatedGoal)
})
// @desc  Delete goal
// @route DELETE /api/goals/:id
// @access private
const DeleteGoal = asyncHandler( async(req,res)=>{
    const goal = await Goal.findById(req.params.id)

    // check for the goal
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    const user  = await User.findById(req.user.id)
   
    // check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the  logged in user matche r the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('user not authorized')
    }
    await goal.remove()
    res.status(200).json({id: req.params.id})
})
module.exports ={getGoals,setGoal,updateGoal,DeleteGoal}