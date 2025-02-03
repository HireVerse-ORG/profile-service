import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import TYPES from "../core/container/container.types";
import { KafkaConnect, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { EventService } from "./event.service";

const kafkaConnect = new KafkaConnect({
    clientId: "profile-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 5, 
        factor: 0.2,
    }
})

export const Producer = new kafka.KafkaProducer(kafkaConnect, {allowAutoTopicCreation: process.env.NODE_ENV === "development"});

export function loadEventContainer(container: Container) {
    container.bind<KafkaProducer>(TYPES.KafkaProducer).toConstantValue(Producer);
    container.bind<EventService>(TYPES.EventService).to(EventService);
}
