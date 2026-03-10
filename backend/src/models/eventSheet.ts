import mongoose, { Schema, Document } from "mongoose";

export interface IAttendanceEntry {
  memberId: string;
  memberName: string;
  present: boolean;
  remark: string;
}

export interface IEventSheet extends Document {
  eventName: string;
  eventDate: string;
  attendance: IAttendanceEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceEntrySchema = new Schema<IAttendanceEntry>({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  present: { type: Boolean, default: false },
  remark: { type: String, default: "" },
});

const EventSheetSchema = new Schema<IEventSheet>(
  {
    eventName: { type: String, required: true },
    eventDate: { type: String, required: true },
    attendance: [AttendanceEntrySchema],
  },
  { timestamps: true },
);

export default mongoose.model<IEventSheet>("EventSheet", EventSheetSchema);
