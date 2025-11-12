import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/inngest.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Hello World");
});

app.use("/api/auth-protected", clerkMiddleware(), (req, res) => {
    res.json({ message: "Authenticated user data", userId: req.auth?.userId });
});
app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
