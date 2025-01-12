import { Container } from "inversify";
import { loadCompanyProfileContainer } from "./profile/company.profile.module";

const loadCompanyContainers = (container: Container) => {
    loadCompanyProfileContainer(container);
};

export {loadCompanyContainers}