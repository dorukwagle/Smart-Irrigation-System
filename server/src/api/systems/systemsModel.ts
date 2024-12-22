import ModelReturnTypes from "../../entities/ModelReturnTypes";
import formatValidationErrors from "../../utils/formatValidationErrors";
import SystemForm, { SystemFormType } from "../../validations/SystemForm";
import prismaClient from "../../utils/prismaClient";
import { v7 } from "uuid";
import SystemUpdateForm, { SystemUpdateFormType } from "../../validations/SystemUpdateForm";
import PaginationParams, { PaginationParamsType } from "../../validations/PaginationParams";
import PaginationReturnTypes from "../../entities/PaginationReturnTypes";
import { DEFAULT_PAGE_SIZE } from "../../entities/constants";
import { getPaginatedItems, WhereArgs } from "../../utils/paginator";

const registerSystem = async (userId: string, body: SystemFormType) => {
    const res = { statusCode: 200 } as ModelReturnTypes;

    const validation = SystemForm.safeParse(body);
    const error = formatValidationErrors(validation);
    if (error) return error;

    const data = validation.data!;

    // create unique system identifier
    const identifier = v7();

    // register the system along with preferences, live status and system session
    const system = await prismaClient.systems.create({
        data: {
            ...data,
            userId,
            preferences: {
                create: {}
            },
            liveStatus: {
                create: {}
            },
            session: {
                create: {
                    systemIdentifier: identifier,
                    userId
                }
            }
        },
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

const getSystems = async (userId: string, params: PaginationParamsType) => {
    const sort = params.seed ? {systemName: "asc"} : {createdAt: "desc"};
    const args: WhereArgs = {
        defaultSeed: params.seed || "",
        fields: [
            {column: "userId", seed: userId},
        ]
    };

    if (params.seed) 
        args.fields.push({column: "systemName"});

    return getPaginatedItems("systems", params, args, [], sort);
}

export {
    registerSystem,
    regenerateIdentifier,
    updateSystem,
    deleteSystem,
    getSystems
}