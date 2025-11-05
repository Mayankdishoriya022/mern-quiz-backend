import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const  app=express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to mongodb")
})
.catch((e)=>{
    console.log("Error connecting to mongodb", e)
})

const questionSchema=mongoose.Schema({
    questions:String,
    options:[String],
    answer:Number
})
const Question=mongoose.model("Question", questionSchema)

const scoreSchema=mongoose.Schema({
    username:String,
    score:Number,
    total:Number,
    date:{
        type:Date,
        default:Date.now
    }
})

const Score=mongoose.model("Score", scoreSchema)

app.get("/question", async (req, res)=>{
    const question = await Question.find()
    res.json(question)
})

app.post("/question", async(req, res)=>{
    const newQ= new Question(req.body)
    await newQ.save()
    res.json({message:"Question added"})
})

app.put("/questions/:id", async(req, res)=>{
    const {id}=req.params
    const {questions, options, answer}=req.body
    await Question.findByIdAndUpdate(id, {questions, options, answer})
    res.json("Updated successfully")
})

app.delete("/questions/:id", async(req, res)=>{
    const {id}=req.params
    await Question.findByIdAndDelete(id)
    res.json("Question Deleted successfully")
})

app.post("/scores", async(req, res)=>{
    const {username, score, total}=req.body
    const newscore= new Score({
        username, score, total
    })
    await newscore.save()
    res.send("score added successfully")
    
})

app.get("/scores/:username",async (req, res)=>{
    const {username}=req.params
    const scores=await Score.find({username}).sort({date:-1})
    res.json(scores)
})

app.listen(4000, ()=>{
    console.log("Server is running on port 4000")
})