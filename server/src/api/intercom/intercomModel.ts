import { z } from "zod";
import { AI_SERVER_URL } from "../../entities/constants";
import ModelReturnTypes from "../../entities/ModelReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import prismaClient from "../../utils/prismaClient";
import LiveStatus, { LiveStatusType } from "../../validations/LiveStatus";


const updateLiveStatus = async (systemId: string, body: LiveStatusType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = LiveStatus.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const data = validation.data!;

    res.data = await prismaClient.liveStatus.update({
        where: {
            systemId
        },
        data: {
            ...data
        }
    });

    // also check if one day has passed
    await increaseCropDays(systemId);

    return res;
}

const increaseCropDays = async (systemId: string) => {
    const activeSession = await prismaClient.cropSessions.findFirst({
        where: {
            systemId,
            sessionActive: true
        }
    });

    if (!activeSession) 
        return;

    const lastDate = activeSession?.lastAgeUpdated || activeSession.createdAt;
    const today = new Date();
    const dayDiff = Math.floor((today.getTime() - lastDate!.getTime()) / (1000 * 3600 * 24));

    if (dayDiff <= 0) return;

    await prismaClient.cropSessions.update({
        where: {
            systemId,
            cropSessionId: activeSession?.cropSessionId
        },
        data: {
            ageCount: {
                increment: dayDiff
            },
            lastAgeUpdated: today
        }
    });
}

const predictIrrigation = async (systemId: string, scheduleId: string | null | undefined, body: LiveStatusType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = LiveStatus.extend({
        irrigationStatus: z.union([
                z.literal("ON"), z.literal("OFF")]).optional()
    }).safeParse(body);

    const error = formatValidationErrors(validation);
    if (error) return error;

    const data = validation.data!;
    // fetch the system session, 
    const session = await prismaClient.cropSessions.findFirst({
        where: {
            systemId,
            sessionActive: true
        }
    });

    if (!session) {
        res.statusCode = 404;
        res.error = {error: "no active session"}
        return res;
    }

    // check if currently irrigating
    const isIrrigating = data.irrigationStatus === "ON";

    // when the client is not irrigating, but the server has active schedule
    if (!isIrrigating && scheduleId) {
        await deleteFalsySchedule(systemId, scheduleId);
        scheduleId = null;
    }

    // when the client is still irrigating, while the server already sent command to stop it
    if (isIrrigating && !scheduleId) {
        console.log("Client force stopped irrigating");
        res.data = {irrigate: 0};
        return res;
    }

    // check if manually override
    const manualOverride = await prismaClient.systemPreferences.findUnique({
        where: {
            systemId,
            isManualOverride: true,
        }
    });

    // call the AI model for irrigation prediction
    const enableIrrigation = manualOverride ? manualOverride.isIrrigationActive : await callPredictionModel(session.cropName, session.ageCount, data as LiveStatusType);

    // save the parameters & prediction in database
    delete data.irrigationStatus;
    await prismaClient.dataStack.create({
        data: {
            systemId,
            ageCount: session.ageCount,
            cropName: session.cropName,
            cropSessionId: session.cropSessionId,
            ...data,
            irrigated: enableIrrigation
        }
    });

    res.data = {irrigate: enableIrrigation ? 1 : 0};

    // if not irrigating, and prediction is to irrigate
    if (!scheduleId && enableIrrigation) {
        console.log("Irrigation started....");
        const scheduleId = await startIrrigation(systemId, session.cropSessionId, session.ageCount);
        res.data = {irrigate: 1, scheduleId};
        return res;
    }

    // if irrigating, and prediction is not to irrigate
    if (scheduleId && !enableIrrigation ){
        console.log("Irrigation stopped....");
        await stopIrrigation(systemId, scheduleId!);
    }

    return res;
}

const startIrrigation = async (systemId: string, sessionId: string, cropAge: number) => {
    const schedule = await prismaClient.schedules.create({
        data: {
            cropSessionId: sessionId,
            cropAge,
            irrigationStartTime: new Date(),
        }
    });

    await prismaClient.systemSessions.update({
        where: {
            systemId
        },
        data: {
            currentSchedule: schedule.scheduleId
        }
    });

    return schedule.scheduleId;
};

const stopIrrigation = async (systemId: string, scheduleId: string) => {
    await prismaClient.schedules.updateMany({
        where: {
            scheduleId
        },
        data: {
            irrigationStopTime: new Date()
        }
    });

    await prismaClient.systemSessions.updateMany({
        where: {
            systemId
        },
        data: {
            currentSchedule: null
        }
    });
}

const callPredictionModel = async (cropName: string, cropDays: number, parameters: LiveStatusType) => {
    // call the AI model for irrigation prediction
    const req = await fetch(AI_SERVER_URL, {
        body: JSON.stringify({
            crop_type: cropName,
            crop_days: cropDays,
            ...parameters
        }),
        method: "POST"
    });

    const res = await req.json();
    return res.irrigate === 1;
};

const deleteFalsySchedule = async (systemId: string, scheduleId: string) => {
    console.log("Deleting falsy schedule");
    await prismaClient.schedules.delete({
        where: {
            scheduleId
        }
    });
    await prismaClient.systemSessions.update({
        where: {
            systemId
        },
        data: {
            currentSchedule: null
        }
    });
}

export {
    updateLiveStatus,
    predictIrrigation
}