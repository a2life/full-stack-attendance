import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
  memberId: string;
  name: string;
}

const MemberSchema = new Schema<IMember>({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<IMember>("Member", MemberSchema);
