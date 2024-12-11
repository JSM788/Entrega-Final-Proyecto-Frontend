import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import Swal from 'sweetalert2';
import 'react-day-picker/style.css';
import { es } from 'date-fns/locale';
import '../Components/Styles/DoubleCalendar.css';
import { useContextGlobal } from '../Components/utils/global.context';

// Función para normalizar las fechas al inicio del día en UTC estrictamente
const getStartOfDayUTC = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const DoubleCalendar = ({ productId, onDateSelect, selectedCity }) => {
  const { state } = useContextGlobal();
  const { isAuth } = state;
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const calendarRef = useRef(null);

  useEffect(() => {
    setSelectedRange({ from: null, to: null });
    if (onDateSelect) onDateSelect({ from: null, to: null });
  }, [selectedCity]);

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const isFutureRange = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    return normalizedDate >= tomorrow;
  };

  const getCalendar = async () => {
    setLoading(true);
    setErrorLoading(false);

    if (!productId) {
      setBookedRanges([]);
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/api/reservations/calendar/${productId}`, // URL dinámica
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data || !response.data.calendar) {
        setBookedRanges([]);
      } else {
        const allBookings = response.data.calendar.flatMap((monthData) =>
          monthData.reservations.map((reservation) => ({
            from: new Date(getStartOfDayUTC(reservation.startDate).getTime() + 24 * 60 * 60 * 1000),
            to: new Date(getStartOfDayUTC(reservation.endDate).getTime() + 24 * 60 * 60 * 1000 - 1),
          })),
        );

        setBookedRanges(allBookings);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
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
            progressBar.style.backgroundColor = '#D9534F';
          }
        },
      });
      setErrorLoading(true);
      setBookedRanges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      getCalendar();
    }
  }, [productId]);
  const handleInputClick = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleRetry = () => {
    Swal.fire({
      title: 'Intentando obtener las fechas de reservas',
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        const progressBar = document.querySelector('.swal2-timer-progress-bar');
        if (progressBar) {
          progressBar.style.backgroundColor = 'blue';
        } else {
          progressBar.style.backgroundColor = '#58B368';
        }
      },
    });
    getCalendar();
  };

  const handleDateSelect = (range) => {
    if (!isAuth) {
      Swal.fire({
        html: `
        <p class="text-[#79747E]">Para continuar, por favor inicia sesión en tu cuenta. ¿No tienes una cuenta? <a href="/singIn" class="text-[#32ceb1]">Regístrate aquí</a></p>
      `,
        showCloseButton: true,
        confirmButtonColor: '#32CEB1',
        confirmButtonText: 'INICIAR SESIÓN',
        preConfirm: () => {
          window.location.href = '/login';
        },
      });
      return;
    }

    if (range?.from && range?.to) {
      // Validar si el rango seleccionado incluye fechas reservadas
      const isInvalidRange = bookedRanges.some(
        (reserved) => range.from <= reserved.to && range.to >= reserved.from, // Chequea si hay solapamiento
      );

      if (isInvalidRange) {
        Swal.fire({
          title: 'La fecha seleccionada no está disponible. Por favor, elige otro rango de fechas.',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            const progressBar = document.querySelector('.swal2-timer-progress-bar');
            if (progressBar) {
              progressBar.style.backgroundColor = '#D9534F';
            }
          },
        });
        return;
      }

      setSelectedRange(range);
      if (onDateSelect) onDateSelect(range);
    } else if (range?.from) {
      setSelectedRange({ from: range.from, to: null });
      if (onDateSelect) onDateSelect({ from: range.from, to: null });
    }
  };

  const formatRange = (range) => {
    if (!range.from && !range.to) return 'Visualizar disponibilidad';
    if (range.from && !range.to) return `Desde: ${range.from.toLocaleDateString()}`;
    return `Desde: ${range.from.toLocaleDateString()} - Hasta: ${range.to.toLocaleDateString()}`;
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
    <div className="relative flex flex-col w-full" ref={calendarRef}>
      <div className="relative flex flex-col lg:flex-row items-center">
        <div className="relative w-full">
          <input
            type="text"
            readOnly
            value={formatRange(selectedRange)}
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
        {errorLoading && (
          <p onClick={handleRetry} className="ml-2 text-blue-500 text-base font-medium underline cursor-pointer">
            Reintentar
          </p>
        )}
      </div>
      {showCalendar && (
        <div className="container-calendar absolute z-10 bg-[#E3E3E3] border border-gray-300 shadow-lg rounded-lg p-6 mt-6 w-[700px]">
          <DayPicker
            numberOfMonths={2}
            mode="range"
            locale={es}
            selected={selectedRange}
            onSelect={handleDateSelect}
            modifiers={{
              reserved: bookedRanges,
              selectedRange, // Agrega el rango seleccionado como modificador
              available: (date) =>
                isFutureRange(date) && !bookedRanges.some((range) => date >= range.from && date <= range.to),
            }}
            modifiersClassNames={{
              reserved: 'bg-[#79747E] text-white rounded-full font-bold',
              selectedRange: '!bg-mintTeal !text-customBlack rounded-full font-bold', // Estilo verde para el rango seleccionado
              available: '', // Opcional, para fechas disponibles
              // disabled: 'bg-[#79747E] text-white rounded-full font-bold', // Para fechas deshabilitadas
              disabled: 'text-[#79747E] rounded-full font-bold', // Para fechas deshabilitadas
            }}
            disabled={[
              ...bookedRanges, // Usar los rangos reservados como fechas deshabilitadas
              (date) => !isFutureRange(date), // Otras condiciones adicionales
            ]}
          />
          {/* Botón para limpiar fechas */}
          <button
            className={`mt-4 p-2 rounded-lg font-semibold shadow-md ${
              selectedRange.from || selectedRange.to ? 'bg-[#32CEB1] text-white' : 'bg-gray-400 text-gray-700'
            }`}
            onClick={() => {
              setSelectedRange({ from: null, to: null });
              if (onDateSelect) onDateSelect({ from: null, to: null });
            }}
            disabled={!selectedRange.from && !selectedRange.to}
          >
            Limpiar Fechas
          </button>
        </div>
      )}
    </div>
  );
};

export default DoubleCalendar;
