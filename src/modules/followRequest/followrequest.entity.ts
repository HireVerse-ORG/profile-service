import { UserRole } from '@hireverse/service-common/dist/token/user/userPayload';
import mongoose, { Document, Schema } from 'mongoose';

export enum FollowRequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

export interface IFollowRequest extends Document {
    requesterId: string;
    requesterType: UserRole;
    targetUserId: string;
    targetUserType: UserRole;
    status: FollowRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

const FollowRequestSchema: Schema = new Schema<IFollowRequest>(
    {
        requesterId: {
            type: String,
            required: true,
        },
        requesterType: {
            type: String,
            required: true,
        },
        targetUserId: {
            type: String,
            required: true,
        },
        targetUserType: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(FollowRequestStatus),
            default: FollowRequestStatus.Pending,
        },
    },
    {
        timestamps: true,
    }
);

FollowRequestSchema.virtual('id').get(function () {
    return this._id;
});

FollowRequestSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const FollowRequest = mongoose.model<IFollowRequest>('FollowRequest', FollowRequestSchema);

export default FollowRequest;
