import { logger } from "../../core/utils/logger";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { EventController } from "../../modules/event/event.controller";

const producer = container.get<KafkaProducer>(TYPES.KafkaProducer);
const consumer = container.get<KafkaConsumer>(TYPES.KafkaConsumer);
const eventController = container.get<EventController>(TYPES.EventController);

export async function startEventService() {
    try {
        await producer.connect();
        await consumer.connect();
        eventController.initializeSubscriptions();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await producer.disconnect();
        await consumer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
