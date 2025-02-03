import { injectable, inject } from "inversify";
import TYPES from "../core/container/container.types";
import { kafka } from "@hireverse/kafka-communication";
import { logger } from "../core/utils/logger";
import { FollowRequestAcceptedEvent, FollowRequestAcceptedMessage, FollowRequestedEvent, FollowRequestedMessage } from "@hireverse/kafka-communication/dist/events";

@injectable()
export class EventService {
  @inject(TYPES.KafkaProducer) private producer!: kafka.KafkaProducer;

  async followRequestedEvent(message: FollowRequestedMessage) {
    try {
      const event = FollowRequestedEvent({ key: message.requestId, value: message });
      await this.producer.sendEvent(event);
    } catch (error: any) {
      logger.error(
        `Failed to publish FollowRequestedEvent event for Request ID: ${message.requestId}. Error: ${error.message || "Unknown error"}`,
        {
          context: "FollowRequestedEvent",
          requestId: message.requestId,
          errorStack: error.stack || "No stack trace",
        }
      );

    }
  }

  async followRequestAcceptedEvent(message: FollowRequestAcceptedMessage) {
    try {
      const event = FollowRequestAcceptedEvent({ key: message.requestId, value: message });
      await this.producer.sendEvent(event);
    } catch (error: any) {
      logger.error(
        `Failed to publish FollowRequestAcceptedEvent event for Request ID: ${message.requestId}. Error: ${error.message || "Unknown error"}`,
        {
          context: "FollowRequestAcceptedEvent",
          requestId: message.requestId,
          errorStack: error.stack || "No stack trace",
        }
      );

    }
  }

}

