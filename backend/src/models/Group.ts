import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroup extends Document {
    topic: string;
    subtopic: string;
    desc: string;
    time: string;
    days: number;
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupSchema: Schema<IGroup> = new Schema(
    {
        topic: {
            type: String,
            required: true,
            minlength: 2,
        },
        subtopic: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
            minlength: 10,
        },
        time: {
            type: String,
            required: true,
        },
        days: {
            type: Number,
            required: true,
            min: 1,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Group: Model<IGroup> = mongoose.model<IGroup>("Group", GroupSchema);

export default Group;
