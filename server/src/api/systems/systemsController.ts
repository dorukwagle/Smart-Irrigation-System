import express from "express";
import { deleteSystem, regenerateIdentifier, registerSystem, updateSystem } from "./systemsModel";
import SessionRequest from "../../entities/SessionRequest";


const systems = express.Router();



// register system
systems.post("/register", async (req: SessionRequest, res) => {
    const {error, statusCode, data} = await registerSystem(req.session!.userId, req.body);
    res.status(statusCode).json(data || error);
});

// regenerate system identifier
systems.post("/regenerate/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await regenerateIdentifier(req.session!.userId, req.params.systemId);
    res.status(statusCode).json(data || error);
});

// update system
systems.put("/update/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await updateSystem(req.session!.userId, req.params.systemId, req.body);
    res.status(statusCode).json(data || error);
});

// delete system
systems.delete("/delete/:systemId", async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await deleteSystem(req.session!.userId, req.params.systemId);
    res.status(statusCode).json(data || error);
});

export default systems;