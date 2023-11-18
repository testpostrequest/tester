import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import userController from "./controllers/userController";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    "extended": true
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!");
});

app.use("/user", userController);

export default app;
