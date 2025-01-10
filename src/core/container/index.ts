import { Container } from "inversify";
import { loadSeekerContainer } from "../../modules/seeker/seeker.module";
import { loadExternalContainer } from "../../modules/external/external.module";

const container = new Container();

loadExternalContainer(container);
loadSeekerContainer(container);

export { container };

