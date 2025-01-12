import { Container } from "inversify";
import { loadSeekerContainer } from "../../modules/seeker/seeker.module";
import { loadExternalContainer } from "../../modules/external/external.module";
import { loadCompanyContainers } from "../../modules/company/company.module";

const container = new Container();

loadExternalContainer(container);
loadSeekerContainer(container);
loadCompanyContainers(container)

export { container };

