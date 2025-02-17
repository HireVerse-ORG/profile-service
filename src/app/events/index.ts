import { logger } from "../../core/utils/logger";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";

const producer = container.get<KafkaProducer>(TYPES.KafkaProducer);

export async function startEventService() {
    try {
        await producer.connect();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await producer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
