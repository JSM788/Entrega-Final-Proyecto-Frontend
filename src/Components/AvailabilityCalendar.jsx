import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const AvailabilityCalendar = ({ productId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");

      console.log(`Requesting reservations for product ${productId}...`);

      const response = await axios.get(`http://localhost:8080/api/reservations/calendar/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received: ", response.data);
      setReservations(response.data.reservations);
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
