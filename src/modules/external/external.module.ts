import { Container } from "inversify";
import { IJobSkillService } from "./job/skill.service.interface";
import TYPES from "../../core/container/container.types";
import { JobSkillService } from "./job/skill.service";

const loadExternalContainer = (container: Container) => {
    container.bind<IJobSkillService>(TYPES.JobSkillService).to(JobSkillService);
};


export {loadExternalContainer}