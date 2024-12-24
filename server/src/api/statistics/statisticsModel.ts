/**
 * selects the system
 * paginate/display all the sessions & also display the total water usage by the system at last
 * selects the session
 * display the water usage by the session
 * paginate/display the schedules
 * display average water usage per week
 * plot the water usage per week against time
 */

import ModelReturnTypes from "../../entities/ModelReturnTypes";
import prismaClient from "../../utils/prismaClient";



const dateDiff = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return 0;
    return date2.getTime() - date1.getTime();
}

const getWeek = (day: number) => {
    if (day % 7 === 0) return day / 7;
    return Math.floor(day / 7) + 1;
}

// get total water usage by the system ( sum of all it's crop sessions)
// also include duration of operation in (days/weeks)
const getTotalWaterUsageBySystem = async (systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const sessionSchedules = await prismaClient.systems.findUnique({
        where : {
            systemId
        },
        include: {
            cropSessions: {
                include: {
                    schedules: true
                }
            }
        }
    });

    if (!sessionSchedules) return res;

    const operationDays = sessionSchedules.cropSessions.reduce((total, {ageCount, initialCropAge}) => 
        total + (ageCount - initialCropAge), 0);
    const operationWeeks = Math.round(operationDays / 7);

    let irrigationDuration = sessionSchedules.cropSessions.reduce((total, session) => {
        const durationPerSession = session.schedules.reduce((total, {irrigationStopTime, irrigationStartTime}) => 
            total += dateDiff(irrigationStopTime, irrigationStartTime), 0);
        return total + durationPerSession;
    }, 0);

    irrigationDuration = Math.round(irrigationDuration / 1000 / 60); // minutes

    const totalWaterConsumed = sessionSchedules.pumpFlowRate * irrigationDuration;

    res.data = {
        operationDays,
        operationWeeks,
        irrigationDuration: irrigationDuration / 60, // hours
        totalWaterConsumed
    }

    return res;
}

// get total water usage by the session (also duration of operation)
const getTotalWaterUsageBySession = async (systemId: string, cropSessionId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const sessions = await prismaClient.systems.findUnique({
        where: {
            systemId
        },
        include: {
            cropSessions: {
                where: {
                    cropSessionId
                },
                include: {
                    schedules: true
                }
            }
        }
    });

    if (!sessions || !sessions.cropSessions.length) return res;

    const operationDays = sessions.cropSessions[0].ageCount - sessions.cropSessions[0].initialCropAge;
    const operationWeeks = Math.round(operationDays / 7);

    let irrigationDuration = sessions.cropSessions[0].schedules.reduce((total, {irrigationStopTime, irrigationStartTime}) => 
        total += dateDiff(irrigationStopTime, irrigationStartTime), 0);

    irrigationDuration = Math.round(irrigationDuration / 1000 / 60); // minutes

    const totalWaterConsumed = sessions.pumpFlowRate * irrigationDuration;

    res.data = {
        operationDays,
        operationWeeks,
        irrigationDuration: irrigationDuration / 60, // hours
        totalWaterConsumed
    }

    return res;
}

// get average water usage per week (plotting of every week's water usage by given session)
const getWaterUsageGraphPerWeek = async (systemId: string, cropSessionId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const data = await prismaClient.systems.findUnique({
        where: {
            systemId
        },
        include: {
            cropSessions: {
                where: {
                    cropSessionId
                },
                include: {
                    schedules: true
                }
            }
        }
    });

    if (!data || !data.cropSessions.length) return res;

    const session = data.cropSessions[0];
    const schedules = session.schedules;

    const totalDays = session.ageCount - session.initialCropAge;
    const totalWeeks = Math.round(totalDays / 7);

    // create a map of weeks and water usage
    const map = new Map();
    for (let i = 1; i <= totalWeeks; i++) 
        map.set(i, 0);

    schedules.forEach(({irrigationStartTime, irrigationStopTime, cropAge}) => {
        const week = getWeek(session.initialCropAge > 1 ? cropAge - session.initialCropAge : cropAge);
        const duration = dateDiff(irrigationStopTime, irrigationStartTime) / 1000 / 60; // minutes
        const waterUsage = data.pumpFlowRate * duration; // water usage in liter of this iteration

        map.set(week, map.get(week) + waterUsage);
    });

    const {initialCropAge, ageCount} = session;
    res.data = {
        initialCropAge,
        ageCount,
        totalWeeks,
        graph: Array.from(map, ([week, waterUsage]) => ({week, waterUsage}))
    }

    return res;
}

export {
    getTotalWaterUsageBySession,
    getTotalWaterUsageBySystem,
    getWaterUsageGraphPerWeek
}