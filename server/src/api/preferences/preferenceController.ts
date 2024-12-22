import express from "express";
import SessionRequest from "../../entities/SessionRequest";
import { updateIrrigationStatus, updateManualOverride } from "./preferenceModel";

const preference = express.Router();

preference.put("/manual-override/:systemId/:status", async (req: SessionRequest<{systemId: string, status: string}>, res) => {
    const {error, statusCode, data} = await updateManualOverride(req.params.systemId, req.params.status);
    res.status(statusCode).json(data || error);
});

preference.put("/irrigation-mode/:systemId/:status", async (req: SessionRequest<{systemId: string, status: string}>, res) => {
    const {error, statusCode, data} = await updateIrrigationStatus(req.params.systemId, req.params.status);
    res.status(statusCode).json(data || error);
});

export default preference;