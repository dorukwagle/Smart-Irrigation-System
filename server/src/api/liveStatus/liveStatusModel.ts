import { create } from "domain";
import ModelReturnTypes from "../../entities/ModelReturnTypes"
import prismaClient from "../../utils/prismaClient";

const getSystemLiveStatus = async (systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    // check if manual override
    const manualOverride = await prismaClient.systemPreferences.findUnique({
        where: {
            systemId,
            isManualOverride: true
        }
    });

    // read live status
    const liveStatus = await prismaClient.liveStatus.findUnique({
        where: {
            systemId
        }
    });

    // fetch active session
    const activeSession = await prismaClient.cropSessions.findFirst({
        where: {
            systemId,
            sessionActive: true
        }
    });

    // fetch recent schedules of active session
    const schedules = await prismaClient.schedules.findMany({
        where: {
            cropSessionId: activeSession?.cropSessionId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5
    });

    res.data = {
        manualOverride: Boolean(manualOverride), 
        liveStatus,
        activeSession,
        schedules
    };
    
    return res;
}

export {
    getSystemLiveStatus
}