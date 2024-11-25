import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import Swal from "sweetalert2";
import "react-day-picker/style.css";

const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const DoubleCalendar = ({ productId }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef(null);

  const tomorrow = getStartOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isFutureRange = (date) => {
    const normalizedDate = getStartOfDay(date);
    return normalizedDate >= tomorrow;
  };

  // *** Validación del productId ***
  if (!productId) {
    return (
      <div className="text-red-600 font-bold">
        No se puede cargar el calendario porque falta el ID del producto.
      </div>
    );
  }

  useEffect(() => {
    const getCalendar = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reservations/calendar/${productId}`, // URL dinámica
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const bookings = response.data.reservations.flatMap((reservation) =>
          reservation.bookings.map((booking) => ({
            from: getStartOfDay(new Date(booking.start_date)),
            to: getStartOfDay(new Date(booking.end_date)),
          }))
        );

        setBookedRanges(bookings);
        setErrorLoading(false);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setErrorLoading(true);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getCalendar(); // Llama a la API solo si `productId` está definido
    }
  }, [productId]); // Escucha cambios en `productId`
  const handleInputClick = () => {
    if (errorLoading) {
      Swal.fire({
        title:
          "Hubo un problema al cargar las fechas. \n Intenta de nuevo más tarde.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          const progressBar = document.querySelector(
            ".swal2-timer-progress-bar"
          );
          if (progressBar) {
            progressBar.style.backgroundColor = "red";
          }
        },
      });
    } else {
      setShowCalendar((prev) => !prev);
    }
  };

  const handleRetry = async () => {
    Swal.fire({
      title: errorLoading
        ? "Recargando calendario..."
        : "Calendario recargado con exito.",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        const progressBar = document.querySelector(".swal2-timer-progress-bar");
        if (progressBar && errorLoading) {
          progressBar.style.backgroundColor = "blue";
        } else {
          progressBar.style.backgroundColor = "green";
        }
      },
    });

    await getCalendar();

    setTimeout(() => {
      Swal.fire({
        title: "Calendario recargado exitosamente.",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          const progressBar = document.querySelector(
            ".swal2-timer-progress-bar"
          );
          if (progressBar) {
            progressBar.style.backgroundColor = "green";
          }
        },
      });
    }, 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col ml-20 md:ml-32" ref={calendarRef}>
      <h4 className="text-left text-black font-bold">Disponibilidad:</h4>
      <div className="relative flex flex-col lg:flex-row items-center w-3/4 lg:w-1/4">
        <div className="relative w-full">
          <input
            type="text"
            readOnly
            value={
              errorLoading ? "Fecha no disponible" : "Visualizar disponibilidad"
            }
            onClick={handleInputClick}
            className="w-full p-2 pr-10 border-4 border-gray-500 rounded-lg cursor-pointer text-left"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-6 8h6M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"
            />
          </svg>
        </div>
        <p
          onClick={handleRetry}
          className="ml-2 text-blue-500 text-base font-medium underline cursor-pointer"
        >
          Reintentar
        </p>
      </div>
      {showCalendar && (
        <div
          className="absolute z-10 bg-gray-200 border border-white shadow-lg p-4 rounded-lg 
               top-full left-32 lg:left-72 transform -translate-x-1/2 mt-2"
        >
          <DayPicker
            numberOfMonths={2}
            mode="default"
            modifiers={{
              reserved: bookedRanges,
              available: (date) =>
                isFutureRange(date) &&
                !bookedRanges.some(
                  (range) => date >= range.from && date <= range.to
                ),
            }}
            modifiersClassNames={{
              reserved: "border-2 border-red-300",
              available: "border-2 border-green-300",
              disabled: "bg-gray-300",
            }}
            disabled={(date) => !isFutureRange(date)}
          />
        </div>
      )}
    </div>
  );
};

export default DoubleCalendar;
