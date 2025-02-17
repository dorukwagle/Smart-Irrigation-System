import express from "express";
import { getTotalWaterUsageBySession, getTotalWaterUsageBySystem, getWaterUsageGraphPerWeek } from "./statisticsModel";
import SessionRequest from "../../entities/SessionRequest";


const statistics = express.Router();

statistics.get("/system-water-usage/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await getTotalWaterUsageBySystem(req.params.systemId);
    res.status(statusCode).json(data || error);
});

statistics.get("/session-water-usage/:systemId/:cropSessionId", async (req: SessionRequest<{systemId: string, cropSessionId: string}>, res) => {
    const {error, statusCode, data} = await getTotalWaterUsageBySession(req.params.systemId, req.params.cropSessionId);
    res.status(statusCode).json(data || error);
});

statistics.get("/session-water-usage-graph/:systemId/:cropSessionId", async (req: SessionRequest<{systemId: string, cropSessionId: string}>, res) => {
    const {error, statusCode, data} = await getWaterUsageGraphPerWeek(req.params.systemId, req.params.cropSessionId);
    res.status(statusCode).json(data || error);
});

export default statistics;