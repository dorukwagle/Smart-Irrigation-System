// import ModelReturnTypes from "../../entities/ModelReturnTypes";
// import PaginationReturnTypes from "../../entities/PaginationReturnTypes";
// import formatValidationErrors from "../../utils/formatValidationErrors";
// import prismaClient from "../../utils/prismaClient";
// import Sample, { SampleType } from "../../validations/Sample";
// import PaginationParams, { PaginationParamsType } from "../../validations/PaginationParams";


// const createSample = async (userId: string, body: SampleType) => {
//     const res = { statusCode: 201 } as ModelReturnTypes;

//     const validation = Sample.safeParse(body);

//     const error = formatValidationErrors(validation);
//     if (error) return error;

//     const data = validation.data!;

//     res.data = await prismaClient.samples.create({
//         data: {
//             ...data,
//             userId,
//         },
//     });

//     return res;
// };

// const deleteSample = async (userId: string, sampleId: string) => {
//     await prismaClient.samples.update({
//         where: {
//             userId,
//             sampleId,
//         },
//         data: {
//             deletedAt: new Date(),
//         }
//     });
// };

// const getFilter = (userId: string, filter: PaginationParamsType) => {
//     const seed = filter.seed;
//     const status = filter.status;

//     const noSeed = { userId, status };
//     const withSeed = {
//         AND: [
//             {
//                 userId,
//                 status,
//                 OR: [
//                     {
//                         title: {
//                             search: seed,
//                         },
//                         body: {
//                             search: seed,
//                         },
//                     },
//                 ],
//             },
//         ],
//     };

//     return seed ? withSeed : noSeed;
// };

// const paginateSamples = async (userId: string, body: PaginationParamsType) => {
//     const res = { statusCode: 200, info: {}, data: {}} as PaginationReturnTypes;

//     const validation = PaginationParams.safeParse(body);
//     const error = formatValidationErrors(validation);
//     if (error) {
//         res.statusCode = error.statusCode;
//         res.error = error.error;
//         return res;
//     };

//     const filter = validation.data!;

//     const page = filter.page || 1;
//     const pageSize = filter.pageSize || parseInt(process.env.PAGE_SIZE || "10");


//     res.data = await prismaClient.samples.findMany({
//         where: getFilter(userId, filter),
//         orderBy: filter.seed
//             ? {
//                   _relevance: {
//                       fields: ["title", "body"],
//                       search: filter.seed || "",
//                       sort: "asc",
//                   },
//               }
//             : {
//                   createdAt: "desc",
//               },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//     });

//     const total = await prismaClient.samples.count({
//         where: getFilter(userId, filter),
//     });

//     res.info.itemsCount = total;
//     res.info.hasNextPage = total > (page * pageSize);

//     return res;
// };

// export { createSample, deleteSample, paginateSamples };
