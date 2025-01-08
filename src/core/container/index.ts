import { Container } from "inversify";
import { loadSeekerContainer } from "../../modules/seeker/seeker.module";

const container = new Container();

loadSeekerContainer(container);

export { container };

