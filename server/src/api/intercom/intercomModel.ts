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

    res.data = await prismaClient.liveStatus.update({
        where: {
            systemId
        },
        data: {
            ...body
        }
    });

    return res;
}

const increaseCropDays = async (systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const activeSession = await prismaClient.cropSessions.findFirst({
        where: {
            systemId,
            sessionActive: true
        }
    });

    if (!activeSession) {
        res.statusCode = 400;
        res.error = {error: "no active session"}
    }

    const lastDate = activeSession?.lastAgeUpdated;
    const today = new Date();
    const dayDiff = Math.floor((today.getTime() - lastDate!.getTime()) / (1000 * 3600 * 24));

    if (dayDiff <= 0) return res;

    res.data = await prismaClient.cropSessions.update({
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

    return res;
}

const predictIrrigation = async (systemId: string, scheduleId: string | null | undefined, body: LiveStatusType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = LiveStatus.safeParse(body);
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
    if (!isIrrigating && scheduleId) 
        await deleteFalsySchedule(systemId, scheduleId);

    // when the client is still irrigating, while the server already sent command to stop it
    if (isIrrigating && !scheduleId && data.currentSchedule) {
        await stopIrrigation(systemId, data.currentSchedule);
        res.data = {irrigate: 0};
        return res;
    }

    // call the AI model for irrigation prediction
    const enableIrrigation = await callPredictionModel(session.cropName, session.ageCount, data);

    // save the parameters & prediction in database
    await prismaClient.dataStack.create({
        data: {
            systemId,
            ageCount: session.ageCount,
            cropName: session.cropName,
            cropSessionId: session.cropSessionId,
            humidity: data.humidity,
            moisture: data.soilMoisture,
            temperature: data.temperature,
            irrigated: enableIrrigation
        }
    })

    // if already irrigating, and prediction is to irrigate, do nothing
    if (isIrrigating && enableIrrigation) {
        res.data = {irrigate: 1};
        return res;
    }

    // if not irrigating, and prediction is not to irrigate, do nothing
    if (!isIrrigating && !enableIrrigation) {
        res.data = {irrigate: 0};
        return res;
    }

    // if not irrigating, and prediction is to irrigate
    if (!isIrrigating && enableIrrigation) {
        const scheduleId = await startIrrigation(systemId, session.cropSessionId, session.ageCount);
        res.data = {irrigate: 1, scheduleId};
        return res;
    }

    // if irrigating, and prediction is not to irrigate
    await stopIrrigation(systemId, data.currentSchedule!);
    res.data = {irrigate: 0};
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
    await prismaClient.schedules.update({
        where: {
            scheduleId
        },
        data: {
            irrigationStopTime: new Date()
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

const callPredictionModel = async (cropName: string, cropDays: number, parameters: LiveStatusType) => {
    // call the AI model for irrigation prediction
    const req = await fetch(AI_SERVER_URL, {
        body: JSON.stringify({
            crop_type: cropName,
            crop_days: cropDays,
            moisture: parameters.soilMoisture,
            temperature: parameters.temperature,
            humidity: parameters.humidity
        }),
        method: "POST"
    });

    const res = await req.json();
    return res.irrigate === 1;
};

const deleteFalsySchedule = async (systemId: string, scheduleId: string) => {
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
    increaseCropDays,
    predictIrrigation
}