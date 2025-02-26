import { loadProto } from '@hireverse/service-protos';
import { container } from '../../core/container';
import { SeekerProfileGrpcController } from '../../modules/seeker/profile/controllers/seeker.profile.grpc.controller';
import containerTypes from '../../core/container/container.types';
import { CompanyProfileGrpcController } from '../../modules/company/profile/controllers/company.profile.grpc.controller';
import { FollowersGrpcController } from '../../modules/follower/controllers/followers.grpc.controller';

const profileProto = loadProto('profile/profile.proto');

const seekerProfileGrpcController = container.get<SeekerProfileGrpcController>(containerTypes.SeekerProfileGrpcController);
const companyProfileGrpcController = container.get<CompanyProfileGrpcController>(containerTypes.CompanyProfileGrpcController);
const followersGrpcController = container.get<FollowersGrpcController>(containerTypes.FollowersGrpcController);

export const seekerProfileService = {
    name: "SeekerProfile Service",
    serviceDefinition: profileProto.profile.SeekerProfileService.service,
    implementation: seekerProfileGrpcController.getProcedures(),
}
export const companyProfileService = {
    name: "CompanyProfile Service",
    serviceDefinition: profileProto.profile.CompanyProfileService.service,
    implementation: companyProfileGrpcController.getProcedures(),
}

export const followerService = {
    name: "Follower Service",
    serviceDefinition: profileProto.profile.FollowerService.service,
    implementation: followersGrpcController.getProcedures(),
}