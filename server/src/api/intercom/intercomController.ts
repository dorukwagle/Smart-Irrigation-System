import express from "express";
import systemAuth from "../../middlewares/intercomAuth";
import SessionRequest from "../../entities/SessionRequest";
import { predictIrrigation, updateLiveStatus } from "./intercomModel";


const intercom = express.Router();

// receive test connection from system with identification
intercom.get("/hello/auth", async (req, res) => res.json({message: "hello"}));

// system state
intercom.post("/system/irrigation", systemAuth, async (req: SessionRequest, res) => {
    const {error, statusCode, data} = await predictIrrigation(req.systemSession?.systemId!, 
        req.systemSession?.currentSchedule, 
        req.body);
    res.status(statusCode).json(data || error);
});

// update live state
intercom.post("/system/live", systemAuth, async (req: SessionRequest, res) => {
    const {error, statusCode} = await updateLiveStatus(req.systemSession?.systemId!, req.body);
    res.status(statusCode).json({status: error ? "error" : "success"});
});


export default intercom;