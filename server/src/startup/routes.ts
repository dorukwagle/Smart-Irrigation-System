import {Express} from "express";
import cookieParser from "cookie-parser";
import auth from "../api/auth/authController";
import users from "../api/users/usersController";
import authorize from "../middlewares/auth";
import systems from "../api/systems/systemsController";
import cropSessions from "../api/cropSessions/cropSessionController";


const api = (p: string) => `/api/${p}`;

const initializeRoutes = (app: Express): void => {
    app.use(cookieParser());

    app.use(api("user"), users);
    app.use(api("auth"), auth);
    app.use(api("systems"), systems);
    app.use(api("crop-sessions"), authorize, cropSessions);
}

export default initializeRoutes;