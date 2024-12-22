import express from "express";
import SessionRequest from "../../entities/SessionRequest";
import { getSystemLiveStatus } from "./liveStatusModel";


const liveStatus = express.Router();

liveStatus.get("/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await getSystemLiveStatus(req.params.systemId);
    res.status(statusCode).json(data || error);
});

export default liveStatus;