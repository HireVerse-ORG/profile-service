import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import ExpressServer from './app/express';
import GrpcServer from './app/grpc';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';
import Database from './core/database';

(async () => {
    checkEnvVariables('DATABASE_URL');
    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5004';
    const grpcPort = process.env.GRPC_PORT || '6004';

    const db = new Database(databaseUrl);
    const expressServer = new ExpressServer();
    const grpcServer = new GrpcServer();
   
    db.connect(); 
    expressServer.start(expressPort);
    grpcServer.start(grpcPort);

    process.on('SIGINT', async () => {
        expressServer.stop();
        grpcServer.close();
        db.disconnect();
    });
    process.on("SIGTERM", () => {
        expressServer.stop();
        grpcServer.close();
        db.disconnect();
    });
})();