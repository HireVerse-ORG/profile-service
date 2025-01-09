import mongoose, { Document, Schema } from 'mongoose';

export interface ISeekerPortfolio extends Document {
    id: string,
    userId: string,
    profileId: string;
    thumbnail: string;    
    title: string;    
    mediaLink: string;    
    createdAt: Date;
    updatedAt: Date;
}

const SeekerPortfolioSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        profileId: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        mediaLink: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

SeekerPortfolioSchema.virtual('id').get(function () {
    return this._id;
});

SeekerPortfolioSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const SeekerPortfolio = mongoose.model<ISeekerPortfolio>('SeekerPortfolio', SeekerPortfolioSchema);

export default SeekerPortfolio;