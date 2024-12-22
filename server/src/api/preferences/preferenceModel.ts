import ModelReturnTypes from "../../entities/ModelReturnTypes";
import prismaClient from "../../utils/prismaClient";

const updateManualOverride = async (systemId: string, status: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    res.data = await prismaClient.systemPreferences.update({
        where: {
            systemId
        },
        data: {
            isManualOverride: status.toLowerCase() === "true"
        }
    });

    return res;
}

const updateIrrigationStatus = async (systemId: string, status: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    res.data = await prismaClient.systemPreferences.update({
        where: {
            systemId
        },
        data: {
            isIrrigationActive: status.toLowerCase() === "true"
        }
    });

    return res;
}

export {
    updateManualOverride,
    updateIrrigationStatus
};