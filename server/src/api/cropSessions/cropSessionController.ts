import express from "express";
import { CROP_TYPES } from "../../entities/constants";
import authorize from "../../middlewares/auth";
import SessionRequest from "../../entities/SessionRequest";
import { activateCropSession, createCropSession, deactivateCropSession, deleteCropSession, paginateCropSessions, updateCropSession } from "./cropSessionModel";


const cropSessions = express.Router();

// get crop names
cropSessions.get("/crop-types", async (req, res) => res.json({cropTypes: CROP_TYPES}));

// get crop sessions
cropSessions.get("/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data, info} = await paginateCropSessions(req.params.systemId, req.query);
    res.status(statusCode).json(error ? error : {data, info});
});

// create crop session
cropSessions.post("/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await createCropSession(req.session!.userId, req.params.systemId, req.body);
    res.status(statusCode).json(data || error);
});

// update crop session
cropSessions.put("/:systemId/:cropSessionId", async (req: SessionRequest<{cropSessionId: string, systemId: string}>, res) => {
    const {error, statusCode, data} = await updateCropSession(req.params.systemId, req.params.cropSessionId, req.body);
    res.status(statusCode).json(data || error);
});

// delete crop session
cropSessions.delete("/:systemId/:cropSessionId", async (req: SessionRequest<{cropSessionId: string, systemId: string}>, res) => {
    const {error, statusCode, data} = await deleteCropSession(req.params.systemId, req.params.cropSessionId);
    res.status(statusCode).json(data || error);
});

// activate crop session
cropSessions.post("/activate/:systemId/:cropSessionId", async (req: SessionRequest<{cropSessionId: string, systemId: string}>, res) => {
    const {error, statusCode, data} = await activateCropSession(req.params.systemId, req.params.cropSessionId);
    res.status(statusCode).json(data || error);
});

// deactivate crop session
cropSessions.post("/deactivate/:systemId/:cropSessionId", async (req: SessionRequest<{cropSessionId: string, systemId: string}>, res) => {
    const {error, statusCode, data} = await deactivateCropSession(req.params.systemId, req.params.cropSessionId);
    res.status(statusCode).json(data || error);
});

export default cropSessions;

