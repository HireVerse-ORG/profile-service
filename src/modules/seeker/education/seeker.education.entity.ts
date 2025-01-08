import mongoose, { Document, Schema } from 'mongoose';

export interface ISeekerEducation extends Document {
    userId: string,
    profileId: string;
    school: string;
    fieldOfStudy: string;
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
    currentlyPursuing: boolean;
    location: {
        city: string;
        country: string;
    };
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const SeekerEducationSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        profileId: {
            type: String,
            required: true,
        },
        school: {
            type: String,
            required: true,
        },
        fieldOfStudy: {
            type: String,
            required: true,
        },
        startMonth: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        startYear: {
            type: Number,
            required: true,
        },
        endMonth: {
            type: Number,
            min: 1,
            max: 12,
        },
        endYear: {
            type: Number,
        },
        currentlyPursuing: {
            type: Boolean,
            default: false,
        },
        location: {
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

SeekerEducationSchema.virtual('id').get(function () {
    return this._id;
});

SeekerEducationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const SeekerEducation = mongoose.model<ISeekerEducation>('SeekerEducation', SeekerEducationSchema);

export default SeekerEducation;