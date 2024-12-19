import {Express} from "express";
import cookieParser from "cookie-parser";
import auth from "../api/auth/authController";
import users from "../api/users/usersController";
import authorize from "../middlewares/auth";
import samples from "../api/sample/samplesController";


const initializeRoutes = (app: Express): void => {
    app.use(cookieParser());

    app.use("/api/user", users);
    app.use("/api/auth", auth);
    app.use("/api/todos", authorize, samples);
}

export default initializeRoutes;