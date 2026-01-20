"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/services/eventService";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();


        let eventsArray = [];

        if (Array.isArray(res.data)) {
          eventsArray = res.data;
        } else if (Array.isArray(res.data.events)) {
          eventsArray = res.data.events;
        } else if (Array.isArray(res.data.data)) {
          eventsArray = res.data.data;
        }

        setEvents(eventsArray);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading events...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No events available
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event._id} href={`/events/${event._id}`}>
              <Card className="cursor-pointer transition hover:shadow-lg">
                <CardContent className="space-y-2 p-4">
                  <h2 className="text-xl font-semibold">
                    {event.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {event.description?.slice(0, 80) || "No description"}
                  </p>
                  <p className="text-sm">
                    📅 {new Date(event.date).toDateString()}
                  </p>
                  <p className="text-sm">
                    🎫 Tickets Left: {event.availableTickets}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
