export interface Member {
  _id: string;
  memberId: string;
  name: string;
}

export interface AttendanceEntry {
  memberId: string;
  memberName: string;
  present: boolean;
  remark: string;
}

export interface EventSheet {
  _id: string;
  eventName: string;
  eventDate: string;
  attendance: AttendanceEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventSheetPayload {
  eventName: string;
  eventDate: string;
  attendance: AttendanceEntry[];
}
