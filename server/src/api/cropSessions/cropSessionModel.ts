import { DEFAULT_PAGE_SIZE } from "../../entities/constants";
import ModelReturnTypes from "../../entities/ModelReturnTypes";
import PaginationReturnTypes from "../../entities/PaginationReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import { getPaginatedItems, WhereArgs } from "../../utils/paginator";
import prismaClient from "../../utils/prismaClient";
import CropSessionForm, { CropSessionFormType } from "../../validations/CropSessionForm";
import PaginationParams, { PaginationParamsType } from "../../validations/PaginationParams";


const createCropSession = async (userId: string, systemId: string, body: CropSessionFormType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = CropSessionForm.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const {ageCount, cropName} = validation.data!;

    res.data = await prismaClient.cropSessions.create({
        data: {
            systemId,
            ageCount,
            initialCropAge: ageCount,
            cropName,
        }
    });

    return res;
}

const updateCropSession = async (systemId: string, cropSessionId: string, body: CropSessionFormType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = CropSessionForm.optional().safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const {ageCount, cropName} = validation.data!;

    if (!ageCount && !cropName) return res;

    res.data = await prismaClient.cropSessions.update({
        where: {
            cropSessionId,
            systemId
        },
        data: {
            ageCount,
            cropName
        }
    });

    return res;
}

const deleteCropSession = async (systemId: string, cropSessionId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    await prismaClient.cropSessions.update({
        where: {
            systemId,
            cropSessionId
        },
        data: {
            deletedAt: new Date()
        }
    });

    res.data = { message: "Crop session deleted" };
    return res;
}

const activateCropSession = async (systemId: string, cropSessionId: string) => {
    const res = { statusCode: 400 } as ModelReturnTypes;

    // check if one of the crop session is already active
    const cropSession = await prismaClient.cropSessions.findFirst({
        where: {
            systemId,
            sessionActive: true
        }
    });

    if (cropSession) {
        res.data = { message: "Cannot Activate more than one session per system" };
        return res;
    }

    await prismaClient.cropSessions.update({
        where: {
            cropSessionId,
            systemId
        },
        data: {
            sessionActive: true
        }
    });

    res.statusCode = 200;
    res.data = { message: "Crop session activated" };
    return res;
}

const deactivateCropSession = async (systemId: string, cropSessionId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    await prismaClient.cropSessions.update({
        where: {
            cropSessionId,
            systemId
        },
        data: {
            sessionActive: false
        }
    });

    res.data = { message: "Crop session deactivated" };
    return res;
}

const paginateCropSessions = async (systemId: string, params: PaginationParamsType) => {
    const sort = params.seed ? {cropName: "asc"} : {createdAt: "desc"};
    const args: WhereArgs = {
        defaultSeed: params.seed || "",
        fields : [
        {column: "systemId", seed: systemId},
        ]
    };
    
    if (params.seed) 
        args.fields.push({column: "cropName"});
    
    return getPaginatedItems("cropSessions", params, args, [], sort);
};

export { 
    createCropSession,
    updateCropSession,
    deleteCropSession,
    activateCropSession,
    deactivateCropSession,
    paginateCropSessions
}