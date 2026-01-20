import api from "@/lib/axios";

export const getAllEvents = async () => {
  const response = await api.get("/events");
  console.log("EVENTS API RAW RESPONSE 👉", response);
  return response;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  console.log("EVENT DETAILS RAW RESPONSE 👉", response);
  return response;
};
