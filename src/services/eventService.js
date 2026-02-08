import api from "@/lib/axios";


export const getAllEvents = (params = {}) => {
  return api.get("/events", { params });
};


export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response;
};
