import express from "express";
import systemAuth from "../../middlewares/intercomAuth";


const intercom = express.Router();

// receive test connection from system with identification
intercom.get("/hello/auth", async (req, res) => res.json({message: "hello"}));


export default intercom;