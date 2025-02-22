import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import TYPES from "../../core/container/container.types";
import { KafkaConnect, KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { logger } from "../../core/utils/logger";

const kafkaConnect = new KafkaConnect({
    clientId: "profile-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 10,              
        initialRetryTime: 500,   
        factor: 0.3,              
        multiplier: 2,           
        maxRetryTime: 60_000,    
        restartOnFailure: async (error) => {
            logger.error("Kafka connection failed:", error);
            return true; 
        },
    }
})

export const producer = new kafka.KafkaProducer(kafkaConnect, {allowAutoTopicCreation: process.env.KAFKA_AUTO_CREATE_TOPICS === "true",});
export const consumer = new kafka.KafkaConsumer(kafkaConnect, { 
    groupId: "profile-group", 
    allowAutoTopicCreation: process.env.KAFKA_AUTO_CREATE_TOPICS === "true",
});

export function loadEventContainer(container: Container) {
    container.bind<KafkaProducer>(TYPES.KafkaProducer).toConstantValue(producer);
    container.bind<KafkaConsumer>(TYPES.KafkaConsumer).toConstantValue(consumer);
    container.bind<EventService>(TYPES.EventService).to(EventService);
    container.bind<EventController>(TYPES.EventController).to(EventController);
}
