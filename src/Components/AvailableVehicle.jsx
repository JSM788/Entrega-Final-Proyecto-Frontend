import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import Swal from 'sweetalert2';
import 'react-day-picker/style.css';
import { es } from 'date-fns/locale'; // Importa el idioma español desde date-fns

// Función para normalizar las fechas al inicio del día en UTC estrictamente
const getStartOfDayUTC = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const DoubleCalendar = ({ productId }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef(null);

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const isFutureRange = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    return normalizedDate >= tomorrow;
  };

  // *** Validación del productId ***
  if (!productId) {
    return (
      <div className="text-red-600 font-bold">No se puede cargar el calendario porque falta el ID del producto.</div>
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
              'Content-Type': 'application/json',
            },
          },
        );

        const allBookings = response.data.calendar.flatMap((monthData) =>
          monthData.reservations.map((reservation) => ({
            from: new Date(getStartOfDayUTC(reservation.startDate).getTime() + 24 * 60 * 60 * 1000),
            to: new Date(getStartOfDayUTC(reservation.endDate).getTime() + 24 * 60 * 60 * 1000 - 1),
          })),
        );

        setBookedRanges(allBookings);
        setErrorLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
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
        title: 'Hubo un problema al cargar las fechas. \n Intenta de nuevo más tarde.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          const progressBar = document.querySelector('.swal2-timer-progress-bar');
          if (progressBar) {
            progressBar.style.backgroundColor = 'red';
          }
        },
      });
    } else {
      setShowCalendar((prev) => !prev);
    }
  };

  const handleRetry = async () => {
    Swal.fire({
      title: errorLoading ? 'Recargando calendario...' : 'Calendario recargado con exito.',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        const progressBar = document.querySelector('.swal2-timer-progress-bar');
        if (progressBar && errorLoading) {
          progressBar.style.backgroundColor = 'blue';
        } else {
          progressBar.style.backgroundColor = 'green';
        }
      },
    });

    await getCalendar();

    setTimeout(() => {
      Swal.fire({
        title: 'Calendario recargado exitosamente.',
        icon: 'success',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          const progressBar = document.querySelector('.swal2-timer-progress-bar');
          if (progressBar) {
            progressBar.style.backgroundColor = 'green';
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col ml-20 md:ml-32" ref={calendarRef}>
      <h4 className="text-left text-black font-bold">Disponibilidad:</h4>
      <div className="relative flex flex-col lg:flex-row items-center w-3/4 lg:w-1/4">
        <div className="relative w-full">
          <input
            type="text"
            readOnly
            value={errorLoading ? 'Fecha no disponible' : 'Visualizar disponibilidad'}
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
        <p onClick={handleRetry} className="ml-2 text-blue-500 text-base font-medium underline cursor-pointer">
          Reintentar
        </p>
      </div>
      {showCalendar && (
        <div
          className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg p-6 mt-4 w-[700px]" // Ajustamos el ancho
        >
          <DayPicker
            numberOfMonths={2}
            mode="default"
            locale={es} // Configura el calendario en español
            modifiers={{
              reserved: bookedRanges,
              available: (date) =>
                isFutureRange(date) && !bookedRanges.some((range) => date >= range.from && date <= range.to),
            }}
            modifiersClassNames={{
              reserved: 'bg-red-100 text-red-600 rounded-full font-bold', // Clases de Material Tailwind
              available: '', // Opcional, para fechas disponibles
              disabled: 'bg-gray-300 text-gray-500', // Para fechas deshabilitadas
            }}
            disabled={(date) => !isFutureRange(date)}
          />
        </div>
      )}
    </div>
  );
};

export default DoubleCalendar;
