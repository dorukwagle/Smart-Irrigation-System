import express from "express";
import SessionRequest from "../../entities/SessionRequest";
import { getPreferences, updatePreferences } from "./preferenceModel";

const preference = express.Router();


preference.get("/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await getPreferences(req.params.systemId);
    res.status(statusCode).json(data || error);
});

preference.put("/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await updatePreferences(req.params.systemId, req.body);
    res.status(statusCode).json(data || error);
});

export default preference;