import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IJobSkillService {
    createSkill(name: string, isActive:boolean): Promise<RPCServiceResponseDto>;
    getSkillFromIds(ids: string[]): Promise<RPCServiceResponseDto>;
    getSkillFromName(name: string): Promise<RPCServiceResponseDto>
}