import mongoose, { Document, Schema } from 'mongoose';

export enum CompanyProfileStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

export interface ICompanyProfile extends Document {
    id: string;
    userId: string;
    companyId: string;
    name: string;
    location: {
        country: string;
        city: string;
    };
    bio: string;
    image: string;
    founded: Date;
    industry: string;
    companyType: string; 
    email: string; 
    phone: string; 
    website: string; 
    socialLinks: { 
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    employeeCount: number;
    status: CompanyProfileStatus;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyProfileSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        companyId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        location: {
            country: { type: String, required: true },
            city: { type: String, required: true },
        },
        bio: { type: String, required: false },
        image: { type: String, required: false },
        founded: { type: Date, required: false }, 
        industry: { type: String, required: true },
        companyType: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        website: { type: String, required: false },
        socialLinks: {
            linkedin: { type: String, required: false },
            twitter: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
        },
        employeeCount: { type: Number, required: false, min: 0 },
        status: { type: String, required: true, enum: Object.values(CompanyProfileStatus), default: CompanyProfileStatus.PENDING },
    },
    {
        timestamps: true,
    }
);

CompanyProfileSchema.virtual('id').get(function () {
    return this._id;
});

CompanyProfileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const CompanyProfile = mongoose.model<ICompanyProfile>('CompanyProfile', CompanyProfileSchema);

export default CompanyProfile;
