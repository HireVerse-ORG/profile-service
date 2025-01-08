import { Container } from "inversify";
import { loadSeekerProfileContainer } from "./profile/seeker.profile.module";

const loadSeekerContainer = (container: Container) => {
    loadSeekerProfileContainer(container);
};

export {loadSeekerContainer}