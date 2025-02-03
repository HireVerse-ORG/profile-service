/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default {
    // profile
    SeekerProfileController: Symbol('SeekerProfileController'),
    SeekerProfileGrpcController: Symbol('SeekerProfileGrpcController'),
    SeekerProfileService: Symbol('SeekerProfileService'),
    SeekerProfileRepository: Symbol('SeekerProfileRepository'),
    // experience
    SeekerExperienceController: Symbol('SeekerExperienceController'),
    SeekerExperienceService: Symbol('SeekerExperienceService'),
    SeekerExperienceRepository: Symbol('SeekerExperienceRepository'),
    // education
    SeekerEducationController: Symbol('SeekerEducationController'),
    SeekerEducationService: Symbol('SeekerEducationService'),
    SeekerEducationRepository: Symbol('SeekerEducationRepository'),
    // portfolio
    SeekerPortfolioController: Symbol('SeekerPortfolioController'),
    SeekerPortfolioService: Symbol('SeekerPortfolioService'),
    SeekerPortfolioRepository: Symbol('SeekerPortfolioRepository'),

    // company
    CompanyProfileController: Symbol('CompanyProfileController'),
    CompanyProfileGrpcController: Symbol('CompanyProfileGrpcController'),
    CompanyProfileService: Symbol('CompanyProfileService'),
    CompanyProfileRepository: Symbol('CompanyProfileRepository'),

    // followers
    FollowersController: Symbol('FollowersController'),
    FollowersGrpcController: Symbol('FollowersGrpcController'),
    FollowersService: Symbol('FollowersService'),
    FollowersRepository: Symbol('FollowersRepository'),

    // followe request
    FollowRequestController: Symbol('FollowRequestController'),
    FollowRequestGrpcController: Symbol('FollowRequestGrpcController'),
    FollowRequestService: Symbol('FollowRequestService'),
    FollowRequestRepository: Symbol('FollowRequestRepository'),

    // external
    JobSkillService: Symbol('JobSkillService'),

    // kafka
    KafkaProducer: Symbol('KafkaProducer'),
    KafkaConsumer: Symbol('KafkaConsumer'),
    EventController: Symbol('EventController'),
    EventService: Symbol('EventService'),
};
