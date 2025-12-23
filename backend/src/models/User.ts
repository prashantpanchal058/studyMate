import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 6,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;