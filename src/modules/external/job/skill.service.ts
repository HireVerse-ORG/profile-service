import { injectable } from "inversify";
import { IJobSkillService } from "./skill.service.interface";
import { jobskillServiceClient } from "../../../core/rpc/clients";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";
import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

@injectable()
export class JobSkillService implements IJobSkillService {
    async getSkillFromName(name: string): Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            jobskillServiceClient.GetSkillFromName({ name }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({ status: 200, message: response });
            })
        })
    }

    async getSkillFromIds(ids: []): Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            jobskillServiceClient.GetSkillsFromIds({ skill_ids: ids }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({ status: 200, message: response });
            })
        })
    }

    async createSkill(name: string, isActive:boolean): Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            jobskillServiceClient.CreateSkill({ name, isActive }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({ status: 201, message: response });
            })
        })
    }
}