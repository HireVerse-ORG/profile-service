import mongoose, { Document, Schema } from 'mongoose';

export interface ISeekerProfile extends Document {
    id: string;
    userId: String,
    profileName: string;
    title: string;
    location: {
        country: string;
        city: string;
    }
    isOpenToWork: boolean;
    bio: string;
    profileUsername: string;
    image: string;
    coverImage: string | null;
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}

const SeekerProfileSchema: Schema = new Schema(
    {
        userId: String,
        profileName: { type: String, required: true },
        title: { type: String },
        location: {
            country: { type: String },
            city: { type: String },
        },
        isOpenToWork: { type: Boolean, default: false },
        bio: { type: String },
        profileUsername: { type: String, required: true, unique: true },
        image: { type: String },
        coverImage: { type: String, default: null },
        skills: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);

SeekerProfileSchema.virtual('id').get(function () {
    return this._id;
});

SeekerProfileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const SeekerProfile = mongoose.model<ISeekerProfile>('SeekerProfile', SeekerProfileSchema);

export default SeekerProfile;
