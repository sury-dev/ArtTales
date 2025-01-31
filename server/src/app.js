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
app.use(express.static("public"));  // Serve static files from the 'public' folder
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://arttales.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ✅ Serve `index.html` for non-API routes from the public folder

// ✅ Debugging: Verify frontend path
console.log("Serving frontend from:", path.join(__dirname, "public"));

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

app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});


app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api") || req.url.endsWith(".js")) {
    return next();
  }
  res.sendFile(path.join(__dirname,"..", "public", "index.html"));  // Serve from the 'public' folder
});
export { app };
