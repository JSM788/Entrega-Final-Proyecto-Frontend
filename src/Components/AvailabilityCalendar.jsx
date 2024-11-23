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

      // Obtener el token del localStorage
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:8080/api/reservations/calendar/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Usar el token aquí
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