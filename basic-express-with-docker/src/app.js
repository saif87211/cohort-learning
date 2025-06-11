import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorhandler.js";

const app = express();

app.use(cors({
    credentials: true,
    origin: "*"
}));

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

//routes
import userRouter from "./routes/user.route.js";

app.get("/", (_, res) => res.status(200).json({ message: "🔥server is hot!!!" }));

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

app.use((_, res) => {
    return res.status(404).send('404: Not Found');
});

export { app };