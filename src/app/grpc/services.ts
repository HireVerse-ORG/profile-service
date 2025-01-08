import { loadProto } from '@hireverse/service-protos';
import { container } from '../../core/container';
import { SeekerProfileGrpcController } from '../../modules/seeker/profile/controllers/seeker.profile.grpc.controller';
import containerTypes from '../../core/container/container.types';

const profileProto = loadProto('profile/profile.proto');

const seekerProfileGrpcController = container.get<SeekerProfileGrpcController>(containerTypes.SeekerProfileGrpcController)

export const seekerProfileService = {
    name: "SeekerProfile Service",
    serviceDefinition: profileProto.profile.ProfileService.service,
    implementation: seekerProfileGrpcController.getProcedures(),
}