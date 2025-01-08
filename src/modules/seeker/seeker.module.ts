import { Container } from "inversify";
import { loadSeekerProfileContainer } from "./profile/seeker.profile.module";
import { loadSeekerEducationContainer } from "./education/seeker.education.module";

const loadSeekerContainer = (container: Container) => {
    loadSeekerProfileContainer(container);
    loadSeekerEducationContainer(container);
};

export {loadSeekerContainer}