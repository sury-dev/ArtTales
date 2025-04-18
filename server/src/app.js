import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(express.json({limit : "16kb"}));

app.use(urlencoded({extended: true, limit : "16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5000',
    'https://art-tales.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
    credentials: true // Allow cookies and authentication headers
}));

// ✅ Routes
import userRouter from "./routes/user.routes.js";
import artRouter from "./routes/artPost.routes.js";
import albumRouter from "./routes/album.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import taleBookRouter from "./routes/taleBook.routes.js";
import followRouter from "./routes/follow.routes.js";

app.use("/api/users", userRouter);
app.use("/api/art", artRouter);
app.use("/api/albums", albumRouter);
app.use("/api/likes", likeRouter);
app.use("/api/comments", commentRouter);
app.use("/api/talebooks", taleBookRouter);
app.use("/api/follow", followRouter);

export { app };
