import mongoose, { Schema, Document, Model } from "mongoose";

export interface Status extends Document {
    userId: mongoose.Types.ObjectId;
    groupMateId: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const StatusSchema: Schema<Status> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupMateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const GroupStatus: Model<Status> = mongoose.model<Status>(
    "GroupStatus",
    StatusSchema
);

export default GroupStatus;
