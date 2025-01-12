import { inject } from "inversify";
import { BaseController } from "../../../../core/base.controller";
import containerTypes from "../../../../core/container/container.types";
import { ICompanyProfileService } from "../interface/company.profile.service.interface";

export class CompanyProfileGrpcController extends BaseController {
    @inject(containerTypes.CompanyProfileService) private companyProfileService!: ICompanyProfileService;

    public getProcedures() {
        return {
           
        }
    }

}