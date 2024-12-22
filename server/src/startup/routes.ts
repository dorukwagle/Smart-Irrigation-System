import {Express} from "express";
import cookieParser from "cookie-parser";
import auth from "../api/auth/authController";
import users from "../api/users/usersController";
import authorize from "../middlewares/auth";
import systems from "../api/systems/systemsController";
import cropSessions from "../api/cropSessions/cropSessionController";
import intercom from "../api/intercom/intercomController";
import intercomAuth from "../middlewares/intercomAuth";
import preference from "../api/preferences/preferenceController";
import liveStatus from "../api/liveStatus/liveStatusController";


const api = (p: string) => `/api/${p}`;

const initializeRoutes = (app: Express): void => {
    app.use(cookieParser());

    app.use(api("user"), users);
    app.use(api("auth"), auth);
    app.use(api("systems"), authorize, systems);
    app.use(api("crop-sessions"), authorize, cropSessions);
    app.use(api("preferences"), authorize, preference);
    app.use(api("live-status"), authorize, liveStatus);

    app.use("/intercom", intercomAuth, intercom);
}

export default initializeRoutes;