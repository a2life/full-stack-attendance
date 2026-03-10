import axios from "axios";
import { Member, EventSheet, CreateEventSheetPayload } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL });

export const fetchMembers = async (): Promise<Member[]> => {
  const res = await api.get("/members");
  return res.data;
};

export const createMember = async (data: {
  memberId: string;
  name: string;
}): Promise<Member> => {
  const res = await api.post("/members", data);
  return res.data;
};

export const updateMember = async (
  id: string,
  data: { memberId: string; name: string },
): Promise<Member> => {
  const res = await api.put(`/members/${id}`, data);
  return res.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await api.delete(`/members/${id}`);
};

export const fetchEventSheets = async (): Promise<EventSheet[]> => {
  const res = await api.get("/eventsheets");
  return res.data;
};

export const fetchEventSheet = async (id: string): Promise<EventSheet> => {
  const res = await api.get(`/eventsheets/${id}`);
  return res.data;
};

export const createEventSheet = async (
  payload: CreateEventSheetPayload,
): Promise<EventSheet> => {
  const res = await api.post("/eventsheets", payload);
  return res.data;
};

export const deleteEventSheet = async (id: string): Promise<void> => {
  await api.delete(`/eventsheets/${id}`);
};
