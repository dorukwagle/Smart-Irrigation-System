import ModelReturnTypes from "../../entities/ModelReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import prismaClient from "../../utils/prismaClient";
import systemPreference, { SystemPreferenceType } from "../../validations/SystemPreference";


const getPreferences = async (systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const data = await prismaClient.systemPreferences.findUnique({
        where: {
            systemId
        }
    });

    res.data = data as any;
    return res;
}

const updatePreferences = async (systemId: string, body: SystemPreferenceType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = systemPreference.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    res.data = await prismaClient.systemPreferences.update({
        where: {
            systemId
        },
        data: {
            ...body
        }
    });

    return res;
}

export {
    getPreferences,
    updatePreferences
};