import mongoose, { Document, Schema } from 'mongoose';

export interface ISeekerExperience extends Document {
    userId: string,
    profileId: string;
    title: string;
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
    currentlyWorking: boolean;
    location: {
        city: string;
        country: string;
    };
    employmentType: string;
    company: {
        companyId?: string; 
        name?: string;
    };
    description: string;
}

const SeekerExperienceSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        profileId: {
            type: String,
            required: true,
        },
        title: {
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
        currentlyWorking: {
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
        company: {
            companyId: {type: String}, 
            name: {type: String}
        },
        employmentType: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
    }
);

SeekerExperienceSchema.virtual('id').get(function () {
    return this._id;
});

SeekerExperienceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const SeekerExperience = mongoose.model<ISeekerExperience>('SeekerExperience', SeekerExperienceSchema);

export default SeekerExperience;