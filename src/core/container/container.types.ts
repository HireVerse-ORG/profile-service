/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default  {
    SeekerProfileController: Symbol('SeekerProfileController'),
    SeekerProfileGrpcController: Symbol('SeekerProfileGrpcController'),
    SeekerProfileService: Symbol('SeekerProfileService'),
    SeekerProfileRepository: Symbol('SeekerProfileRepository'),
};
