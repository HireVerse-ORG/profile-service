import { Producer } from "./event.container";
import { logger } from "../core/utils/logger";


export async function startEventService() {
    try {
        await Producer.connect();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await Producer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
