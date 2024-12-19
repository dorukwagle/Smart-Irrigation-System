import { Request } from 'express';
import {Sessions, SystemSessions} from "@prisma/client";

export default interface SessionRequest<TParams={}, TResBody=any, TReqBody=any, TQuery={}>
    extends Request<TParams, TResBody, TReqBody, TQuery> {
    session?: Sessions;
    systemSession?: SystemSessions;
}