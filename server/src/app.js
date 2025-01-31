import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://arttales.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ✅ Serve frontend build files
const frontendPath = path.join(__dirname, "../../client/dist");
app.use(express.static(frontendPath));

// ✅ Serve `index.html` for non-API routes
app.get("*", (req, res, next) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Debugging: Verify frontend path
console.log("Serving frontend from:", frontendPath);

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
