import express from "express";
import systemAuth from "../../middlewares/systemAuth";
import authorize from "../../middlewares/auth";
import { deleteSystem, regenerateIdentifier, registerSystem } from "./systemsModel";
import SessionRequest from "../../entities/SessionRequest";


const systems = express.Router();

// receive test connection from system with identification
systems.get("/hello/auth", systemAuth, async (req, res) => res.json({message: "hello"}));

// receive test connection from system
systems.get("/hello", async (req, res) => res.json({message: "hello"}));

// register system
systems.post("/register", authorize, async (req: SessionRequest, res) => {
    const {error, statusCode, data} = await registerSystem(req.session!.userId, req.body);
    res.status(statusCode).json(data || error);
});

// regenerate system identifier
systems.post("/regenerate/:systemId", authorize, async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await regenerateIdentifier(req.session!.userId, req.params.systemId);
    res.status(statusCode).json(data || error);
});

// delete system
systems.delete("/delete/:systemId", authorize, async (req: SessionRequest<{systemId: string}>, res) => {
    const {error, statusCode, data} = await deleteSystem(req.session!.userId, req.params.systemId);
    res.status(statusCode).json(data || error);
});

export default systems;