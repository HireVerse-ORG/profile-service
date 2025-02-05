import { IPaginationResponse, MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Followers, { FollowRequestStatus, IFollowers } from "./followers.entity";
import { IFollowersRepository } from "./interfaces/followers.repository.interface";
import { RootFilterQuery } from "mongoose";
import { InternalError } from "@hireverse/service-common/dist/app.errors";
import { FindFollowersFilter, FindFollowerDTO } from "./dto/followers.dto";

@injectable()
export class FollowersRepository extends MongoBaseRepository<IFollowers> implements IFollowersRepository {
    constructor() {
        super(Followers)
    }

    async countFollowers(filter?: RootFilterQuery<IFollowers>): Promise<number> {
        try {
            const count = await this.repository.countDocuments(filter);
            return count;
        } catch (error) {
            throw new InternalError("Failed to count Follow Request Documents")
        }
    }

    async findPaginatedFollowers(filter: FindFollowersFilter): Promise<IPaginationResponse<FindFollowerDTO>> {
        const { followedUserId, followerId, query, checkMutual, page, limit } = filter;

        const pipeline: any[] = [
            // 1. Match documents for the given followed user and accepted follow requests.
            {
                $match: {
                    followedUserId,
                    requestStatus: FollowRequestStatus.Accepted
                }
            },
            // 2. Lookup the profile details from SeekerProfile if followedUserType is "seeker"
            {
                $lookup: {
                    from: "seekerprofiles",
                    let: { fUserId: "$followerId", fUserType: "$followerUserType" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$fUserId"] },
                                        { $eq: ["$$fUserType", "seeker"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                name: "$profileName",
                                title: 1,
                                image: 1,
                                type: "$$fUserType",
                                userId: 1,
                                publicId: "$profileUsername"
                            }
                        }
                    ],
                    as: "seekerProfile"
                }
            },
            // 3. Lookup the profile details from CompanyProfile if followedUserType is "company"
            {
                $lookup: {
                    from: "companyprofiles",
                    let: { fUserId: "$followerId", fUserType: "$followerUserType" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$fUserId"] },
                                        { $eq: ["$$fUserType", "company"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                title: "$companyType",
                                image: 1,
                                type: "$$fUserType",
                                userId: 1,
                                publicId: "$companyId"
                            }
                        }
                    ],
                    as: "companyProfile"
                }
            },
            // 4. Merge the joined profile data into one field: followedUserProfile
            {
                $addFields: {
                    followedUserProfile: {
                        $cond: [
                            { $eq: ["$followerUserType", "seeker"] },
                            { $arrayElemAt: ["$seekerProfile", 0] },
                            {
                                $cond: [
                                    { $eq: ["$followerUserType", "company"] },
                                    { $arrayElemAt: ["$companyProfile", 0] },
                                    null
                                ]
                            }
                        ]
                    }
                }
            },
            // 5. Remove temporary arrays from the lookup
            {
                $project: {
                    seekerProfile: 0,
                    companyProfile: 0
                }
            }
        ];

        if (query) {
            pipeline.push({
                $match: {
                    "followedUserProfile.name": { $regex: query, $options: "i" }
                }
            });
        }

        // 6. If checkMutual is true, perform a lookup in the same collection to check mutuality.
        if (checkMutual) {
            pipeline.push({
                $lookup: {
                    from: "followers",
                    let: { loggedInUserId: followerId, potentialMutualId: "$followerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$followerId", "$$loggedInUserId"] },
                                        { $eq: ["$followedUserId", "$$potentialMutualId"] },
                                        { $in: ["$requestStatus", [FollowRequestStatus.Accepted, FollowRequestStatus.Pending]] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "mutualCheck"
                }
            });
            pipeline.push({
                $addFields: {
                    isMutual: { $gt: [{ $size: "$mutualCheck" }, 0] }
                }
            });
            pipeline.push({ $project: { mutualCheck: 0 } });
        } else {
            // If we are not checking mutual relationships, simply add isMutual as false.
            pipeline.push({
                $addFields: { isMutual: true }
            });
        }
        

        // 7. Project the fields for FindFollowerDTO.
        pipeline.push({
            $project: {
                followId: "$_id",
                _id: 0,
                name: "$followedUserProfile.name",
                title: "$followedUserProfile.title",
                image: "$followedUserProfile.image",
                userType: "$followedUserProfile.type",
                userId: "$followedUserProfile.userId",
                publicId: "$followedUserProfile.publicId",
                isMutual: 1
            }
        });

        // 8. Sort by createdAt in descending order (newest first)
        pipeline.push({ $sort: { createdAt: -1 } });

        // 9. Add pagination stages.
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: limit });

        // Execute the aggregation.
        const followers: FindFollowerDTO[] = await this.repository.aggregate(pipeline);

        const total = await this.repository.countDocuments({
            followedUserId,
            requestStatus: FollowRequestStatus.Accepted
        });

        // Calculate pagination details.
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            data: followers,
            total,
            hasNextPage,
            hasPreviousPage,
            totalPages,
            currentPage: page,
            limit
        };
    }

}