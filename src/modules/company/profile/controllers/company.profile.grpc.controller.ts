import { inject } from "inversify";
import { BaseController } from "../../../../core/base.controller";
import containerTypes from "../../../../core/container/container.types";
import { ICompanyProfileService } from "../interface/company.profile.service.interface";
import { grpcWrapper } from "../../../../core/utils/grpcWrapper";

export class CompanyProfileGrpcController extends BaseController {
    @inject(containerTypes.CompanyProfileService) private companyProfileService!: ICompanyProfileService;

    public getProcedures() {
        return {
            GetCompanyProfileByUserId: this.getProfileByUserId.bind(this),
            GetCompanyProfilesByLocation: this.getCompanyProfilesByLocation.bind(this),
            GetCompanyProfilesByIdList: this.getCompanyProfilesByIdList.bind(this),
        }
    }

    private getProfileByUserId = grpcWrapper(async (call: any, callback: any) => {
        let { userId } = call.request;
        const profile = await this.companyProfileService.getProfileByUserId(userId);
        callback(null, { profile})
    })

    private getCompanyProfilesByLocation = grpcWrapper(async (call: any, callback: any) => {
        let { location, place } = call.request;
        const profiles = await this.companyProfileService.getCompanyProfilesByLocation({...location, place});
        callback(null, { profiles })
    })

    private getCompanyProfilesByIdList = grpcWrapper(async (call: any, callback: any) => {
        let { ids} = call.request;
        const profiles = await this.companyProfileService.getCompanyProfilesByIdList(ids);
        callback(null, { profiles })
    })

}