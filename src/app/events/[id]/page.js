"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/services/bookingService";
import { useRouter } from "next/navigation";

export default function EventDetailsPage() {
  const params = useParams(); // ✅ correct way
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const handleBooking = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    setBookingLoading(true);

    const res = await createBooking({
      eventId: event._id,
      ticketCount: 1, 
    });

    alert("Booking created. Proceed to payment.");

    router.push(`/payment/${res.data.booking._id}`);
  } catch (err) {
    console.error("BOOKING ERROR ❌", err.response?.data || err);
    alert(err.response?.data?.message || "Booking failed");
  } finally {
    setBookingLoading(false);
  }
};

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await getEventById(eventId);

        console.log("EVENT DETAILS RAW 👉", res.data);

        let eventData = null;

        if (res.data?.event) {
          eventData = res.data.event;
        } else if (res.data?.data) {
          eventData = res.data.data;
        } else if (res.data?._id) {
          eventData = res.data;
        }

        setEvent(eventData);
      } catch (err) {
        console.error("EVENT DETAILS ERROR ❌", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <p className="p-6 text-center">Loading event...</p>;
  }

  if (!event) {
    return <p className="p-6 text-center text-red-500">Event not found</p>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>

      <p className="text-muted-foreground">
        {event.description || "No description available"}
      </p>

      <div className="space-y-1">
        <p>📅 {new Date(event.createdAt).toDateString()}</p>
        <p>📍 {event.location || "Location not specified"}</p>
        <p>🎫 Available Tickets: {event.availableTickets}</p>
        <p>💰 Price: ₹{event.ticketPrice}</p>
      </div>

      <Button
        className="w-full"
        disabled={event.availableTickets === 0 || bookingLoading}
        onClick={handleBooking}
      >
        {bookingLoading ? "Booking..." : "Book Ticket"}
      </Button>
    </div>
  );
}
