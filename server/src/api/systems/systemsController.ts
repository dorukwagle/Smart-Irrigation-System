import express from "express";
import { deleteSystem, getSystems, regenerateIdentifier, registerSystem, updateSystem } from "./systemsModel";
import SessionRequest from "../../entities/SessionRequest";


const systems = express.Router();

systems.get("/", async (req: SessionRequest, res) => {
    const {error, statusCode, data, info} = await getSystems(req.session!.userId, req.query);
    res.status(statusCode).json(error ? error : {data, info});
});

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