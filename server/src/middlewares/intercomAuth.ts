import {Request, Response, NextFunction} from "express";
import SessionRequest from "../entities/SessionRequest";
import prismaClient from "../utils/prismaClient";


const getSystemSession = async(req: Request<{}, any, any, {identifier?: string}>) => {
    const identifier = req.query.identifier;
    if (!identifier) return null;

    return prismaClient.systemSessions.findFirst({
        where:  {
                    systemIdentifier: identifier
                },
    });
}


const intercomAuth = async (req: SessionRequest, res: Response, next: NextFunction) => {
   const session = await getSystemSession(req);
    if (!session) return res.status(401).json({error: "please identify the device first"});

    req.systemSession = session;
    next();
}

export default intercomAuth;