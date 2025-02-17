import { Container } from "inversify";
import { loadSeekerContainer } from "../../modules/seeker/seeker.module";
import { loadExternalContainer } from "../../modules/external/external.module";
import { loadCompanyContainers } from "../../modules/company/company.module";
import { loadFollowersContainer } from "../../modules/follower/followers.module";
import { loadEventContainer } from "../../modules/event/event.module";

const container = new Container();

loadEventContainer(container);
loadExternalContainer(container);
loadSeekerContainer(container);
loadCompanyContainers(container);
loadFollowersContainer(container);

export { container };

