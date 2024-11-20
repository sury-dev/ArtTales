import express, { urlencoded } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,
// }))

app.use(cors({
    origin: ["https://art-tales-frontend.vercel.app/", "http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
    }
));

app.options('*', cors());

//routes

import userRouter from "./routes/user.routes.js"
import artRouter from "./routes/artPost.routes.js"
import albumRouter from "./routes/album.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import taleBookRouter from "./routes/taleBook.routes.js"
import followRouter from "./routes/follow.routes.js"
//routes declaration




app.use("/api/users", userRouter)
app.use("/api/art", artRouter)
app.use("/api/albums", albumRouter)
app.use("/api/likes", likeRouter)
app.use("/api/comments", commentRouter)
app.use("/api/talebooks", taleBookRouter)
app.use("/api/follow", followRouter)
app.get("/", async (req, res) => {
    res.status(200).send({ message: "OK" });
})

export { app };