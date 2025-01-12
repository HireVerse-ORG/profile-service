import { Container } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { CompanyProfileController } from "./controllers/company.profile.controller";
import { CompanyProfileGrpcController } from "./controllers/company.profile.grpc.controller";
import { ICompanyProfileService } from "./interface/company.profile.service.interface";
import { CompanyProfileService } from "./company.profile.service";
import { CompanyProfileRepository } from "./company.profile.repository";
import { ICompanyProfileRepository } from "./interface/company.profile.repository.interface";

const loadCompanyProfileContainer = (container: Container) => {
    container.bind<CompanyProfileGrpcController>(containerTypes.CompanyProfileGrpcController).to(CompanyProfileGrpcController);
    container.bind<CompanyProfileController>(containerTypes.CompanyProfileController).to(CompanyProfileController);
    container.bind<ICompanyProfileService>(containerTypes.CompanyProfileService).to(CompanyProfileService);
    container.bind<ICompanyProfileRepository>(containerTypes.CompanyProfileRepository).to(CompanyProfileRepository);
};

export {loadCompanyProfileContainer}