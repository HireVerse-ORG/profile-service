import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { UserCreatedMessage } from "@hireverse/kafka-communication/dist/events";
import { logger } from "../../core/utils/logger";
import { ISeekerProfileService } from "../seeker/profile/interface/seeker.profile.service.interface";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;

    async initializeSubscriptions() {
        await this.consumer.subscribeToTopics([
            { topic: KafkaTopics.USER_CREATED, handler: this.userCreatedHandler },
        ])
    }

    private userCreatedHandler = async (message: UserCreatedMessage) => {
        const { userId, role, fullName } = message;
        try {
            if(role === "seeker"){
                const profileUsername = await this.seekerProfileService.generateUniqueProfileUsername(fullName);
                await this.seekerProfileService.createProfile({
                    userId,
                    profileName: fullName,
                    profileUsername
                })
            }
        
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.FOLLOW_REQUESTED}`);
        }
    }
}