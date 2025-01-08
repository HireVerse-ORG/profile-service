import { inject } from "inversify";
import { BaseController } from "../../../../core/base.controller";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerProfileService } from "../interface/seeker.profile.service.interface";
import { grpcWrapper } from "../../../../core/utils/grpcWrapper";

export class SeekerProfileGrpcController extends BaseController {
    @inject(containerTypes.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;

    public getProcedures() {
        return {
            CreateSeekerProfile: this.createProfile.bind(this),
        }
    }

    private createProfile = grpcWrapper(async (call: any, callback: any) => {        
        let { profileName, userId, profileUsername } = call.request;
        
        if (!profileUsername) {
            profileUsername = await this.seekerProfileService.generateUniqueProfileUsername(profileName);
        }
        
        await this.seekerProfileService.createProfile({profileName, userId, profileUsername})

        callback(null, {message: "Profile created"})
    })
}