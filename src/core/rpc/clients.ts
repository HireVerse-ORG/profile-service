import { checkEnvVariables } from '@hireverse/service-common/dist/utils';
import {JobskillServiceClient} from '@hireverse/service-protos/dist/clients/job-client';

checkEnvVariables('JOB_SERVICE_URL');
export const jobskillServiceClient = JobskillServiceClient(process.env.JOB_SERVICE_URL!);