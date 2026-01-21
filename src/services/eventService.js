import api from "@/lib/axios";

export const getAllEvents = async () => {
  const response = await api.get("/events");
  return response;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response;
};
