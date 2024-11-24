import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const AvailabilityCalendar = ({ productId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/api/reservations/calendar/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidXNlciIsImlhdCI6MTczMjEzNzA5OCwiZXhwIjoxNzMyMjIzNDk4fQ.AUFQINXBvnG1YIvjb4HyCJCA230960jtYT-n2mnIqtE",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la disponibilidad. Intenta más tarde.");
      }

      const data = await response.json();
      setReservations(data.reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [productId]);

  const events = reservations.flatMap((reservation) =>
    reservation.bookings.map((booking) => ({
      title: `Reservado (${booking.client})`,
      start: booking.start_date,
      end: booking.end_date,
    }))
  );

  return (
    <div>
      {loading && <p>Cargando disponibilidad...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} locale="es" />
      )}
    </div>
  );
};

export default AvailabilityCalendar;
