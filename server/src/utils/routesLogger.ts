import { Request, Response, NextFunction } from 'express';

const routesLogger = (verbose: boolean = false) => (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${req.ip}][${req.method}]: ${req.originalUrl}`);

    if (verbose && (req.method === "POST" || req.method === "PUT"))
        console.log("Body", req.body, "\n");

    next();
}

export default routesLogger;