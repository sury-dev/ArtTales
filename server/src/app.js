import express, { urlencoded } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({limit : "16kb"}));

app.use(urlencoded({extended: true, limit : "16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

app.use(cors({
    origin : process.env.CORS_ORIGIN,
}))

//routes

import userRouter from "./routes/user.routes.js"
import artRouter from "./routes/artPost.routes.js"

//routes declaration

app.use("/api/users", userRouter)
app.use("/api/art", artRouter)
app.post("/", async (req, res)=>{
    res.status(200).send({message : "OK"});
})

export { app };