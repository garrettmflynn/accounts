import { UserObj } from "../../common/models/user.model";
import { model, Schema, Document } from "mongoose";

const schema = new Schema<UserObj>({
    email: { type: String, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    image: { type: String, required: false },
    identities: [{id:String, providerType: String}],
    customUserData:  { type: Schema.Types.Mixed, required: true }
}, {
    timestamps: true,
    minimize: false
});

export const User = model('User', schema);

export type User_Doc = UserObj & Document;