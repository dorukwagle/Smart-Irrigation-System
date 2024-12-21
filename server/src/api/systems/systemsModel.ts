import ModelReturnTypes from "../../entities/ModelReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import SystemForm, { SystemFormType } from "../../validations/SystemForm";
import prismaClient from "../../utils/prismaClient";
import { v7 } from "uuid";
import SystemUpdateForm, { SystemUpdateFormType } from "../../validations/SystemUpdateForm";

const registerSystem = async (userId: string, body: SystemFormType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = SystemForm.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const data = validation.data!;

    // register the system
    const system = await prismaClient.systems.create({
        data: {
            ...data,
            userId
        }
    });

    // create unique system identifier
    const identifier = v7();

    // create system session
    await prismaClient.systemSessions.create({
        data: {
            systemIdentifier: identifier,
            systemId: system.systemId,
            userId
        }
    });

    res.data = { ...system, identifier};

    return res;
}

const regenerateIdentifier = async (userId: string, systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const identifier = v7();

    await prismaClient.systemSessions.update({
        where: {
            systemId,
            userId
        },
        data: {
            systemIdentifier: identifier
        }
    });

    res.data = { identifier };
    return res;
}

const updateSystem = async (userId: string, systemId: string, body: SystemUpdateFormType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = SystemUpdateForm.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const data = validation.data!;
    if (!(data.pumpFlowRate || data.systemName)) return res;

    res.data = await prismaClient.systems.update({
        where: {
            systemId,
            userId
        },
        data
    });

    return res;
}

const deleteSystem = async (userId: string, systemId: string) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    await prismaClient.systems.delete({
        where: {
            systemId,
            userId
        }
    });

    res.data = { message: "System deleted" };
    return res;
}

export {
    registerSystem,
    regenerateIdentifier,
    updateSystem,
    deleteSystem
}