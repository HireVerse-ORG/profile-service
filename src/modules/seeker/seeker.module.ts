import { Container } from "inversify";
import { loadSeekerProfileContainer } from "./profile/seeker.profile.module";
import { loadSeekerEducationContainer } from "./education/seeker.education.module";
import { loadSeekerPortfolioContainer } from "./portfolio/seeker.portfolio.module";

const loadSeekerContainer = (container: Container) => {
    loadSeekerProfileContainer(container);
    loadSeekerEducationContainer(container);
    loadSeekerPortfolioContainer(container);
};

export {loadSeekerContainer}