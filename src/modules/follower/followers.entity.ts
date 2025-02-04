import { UserRole } from '@hireverse/service-common/dist/token/user/userPayload';
import mongoose, { Document, Schema } from 'mongoose';

export enum FollowRequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

export interface IFollowers extends Document {
    id: string;
    followerId: string,
    followerUserType: UserRole;
    followedUserId: string;
    followedUserType: UserRole;
    requestStatus: FollowRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

const FollowersSchema: Schema = new Schema<IFollowers>(
    {
        followerId: {
            type: String,
            required: true
        },
        followerUserType: {
            type: String,
            required: true
        },
        followedUserId: {
            type: String,
            required: true
        },
        followedUserType: {
            type: String,
            required: true
        },
        requestStatus: {
            type: String,
            enum: Object.values(FollowRequestStatus),
            default: FollowRequestStatus.Pending,
        },
    },
    {
        timestamps: true,
    }
);

FollowersSchema.virtual('id').get(function () {
    return this._id;
});

FollowersSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const Followers = mongoose.model<IFollowers>('Followers', FollowersSchema);

export default Followers;
