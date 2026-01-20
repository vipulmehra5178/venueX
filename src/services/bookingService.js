import api from "@/lib/axios";

export const createBooking = (data) => {
  return api.post("/bookings", data);
};

export const confirmPayment = (data) => {
  return api.post("/bookings/confirm-payment", data);
};

export const cancelBooking = (data) => {
  return api.post("/bookings/cancel", data);
};
