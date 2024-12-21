import ModelReturnTypes from "../../entities/ModelReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import SystemForm, { SystemFormType } from "../../validations/SystemForm";
import prismaClient from "../../utils/prismaClient";
import { v7 } from "uuid";

const registerSystem = async (userId: string, body: SystemFormType) => {
    const res = { statusCode: 400 } as ModelReturnTypes;

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

    res.statusCode = 200;
    return res;
}

export {
    registerSystem
}